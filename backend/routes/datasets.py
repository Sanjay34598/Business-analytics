from flask import Blueprint, request, jsonify
import os
import subprocess
from services.dataset_manager import get_datasets, add_dataset, set_active_dataset, delete_dataset, update_dataset_status
from services.load_data import reload_data

datasets_bp = Blueprint("datasets", __name__)

@datasets_bp.route("/datasets", methods=["GET"])
def list_datasets():
    try:
        datasets = get_datasets()
        return jsonify(datasets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@datasets_bp.route("/datasets/upload", methods=["POST"])
def upload_dataset():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
        
    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Only CSV files are allowed"}), 400
        
    try:
        content = file.read()
        dataset_info = add_dataset(file.filename, content)
        return jsonify({"message": "Dataset uploaded successfully", "dataset": dataset_info})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@datasets_bp.route("/datasets/<dataset_id>/active", methods=["PUT"])
def activate_dataset(dataset_id):
    try:
        dataset_info = set_active_dataset(dataset_id)
        reload_data()
        return jsonify({"message": "Dataset activated successfully", "dataset": dataset_info})
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@datasets_bp.route("/datasets/<dataset_id>", methods=["DELETE"])
def remove_dataset(dataset_id):
    try:
        dataset_info = delete_dataset(dataset_id)
        return jsonify({"message": "Dataset deleted successfully", "dataset": dataset_info})
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@datasets_bp.route("/datasets/analyze", methods=["POST"])
def analyze_dataset():
    data = request.json or {}
    dataset_id = data.get("dataset_id")
    
    if dataset_id:
        update_dataset_status(dataset_id, "Processing...")
        
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(os.path.dirname(current_dir))
        
        # Paths
        dataset_info = next((d for d in get_datasets() if d["id"] == dataset_id), None)
        uploaded_path = os.path.join(project_root, "backend", "data", "uploads", f"{dataset_id}.csv") if dataset_info else "Unknown"
        pipeline_input_path = os.path.join(project_root, "ml", "data", "raw", "sales", "sales_data.csv")
        
        print(f"Active dataset ID: {dataset_id}")
        print(f"Uploaded dataset path: {uploaded_path}")
        print(f"Pipeline input path: {pipeline_input_path}")
        
        result = subprocess.run(
            ["python", "ml/pipeline/run_pipeline.py"],
            cwd=project_root,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            if dataset_id:
                update_dataset_status(dataset_id, "Failed")
            
            stderr = result.stderr or ""
            stdout = result.stdout or ""
            
            import re
            failed_stage = "Unknown"
            stage_match = re.findall(r"Failed ([\w/.]+)", stdout + stderr)
            if stage_match:
                failed_stage = stage_match[-1]
                
            exception_type = "Exception"
            message = "Pipeline execution failed"
            
            tb_lines = stderr.strip().split('\n')
            if tb_lines:
                last_line = tb_lines[-1]
                if ":" in last_line and "Traceback" not in last_line:
                    parts = last_line.split(":", 1)
                    exception_type = parts[0].strip()
                    message = parts[1].strip()
                else:
                    message = last_line

            return jsonify({
                "success": False,
                "failed_stage": failed_stage,
                "exception": exception_type,
                "message": message,
                "stdout": stdout,
                "stderr": stderr,
                "traceback": stderr,
                "exit_code": result.returncode
            }), 500
            
        # Verify files exist and are non-empty
        processed_dir = os.path.join(project_root, "ml", "data", "processed")
        required_files = [
            "sales_processed.csv",
            "forecast_results.csv",
            "churn_prediction.csv",
            "product_recommend.csv"
        ]
        
        for f in required_files:
            file_path = os.path.join(processed_dir, f)
            if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
                if dataset_id:
                    update_dataset_status(dataset_id, "Failed")
                return jsonify({
                    "success": False,
                    "failed_stage": "File Verification",
                    "exception": "FileNotFoundError",
                    "message": f"Required output file is missing or empty: {f}",
                    "stdout": result.stdout,
                    "stderr": "",
                    "traceback": "",
                    "exit_code": 1
                }), 500
                
        # Backup processed files for dataset switching
        import shutil
        dataset_processed_dir = os.path.join(project_root, "backend", "data", "processed", dataset_id)
        os.makedirs(dataset_processed_dir, exist_ok=True)
        for f in required_files:
            shutil.copy2(os.path.join(processed_dir, f), os.path.join(dataset_processed_dir, f))
                
        # Reload data
        reload_data()
        
        import services.load_data as ld
        sales_len = len(ld.sales) if ld.sales is not None and not ld.sales.empty else 0
        forecast_len = len(ld.forecast) if ld.forecast is not None and not ld.forecast.empty else 0
        churn_len = len(ld.churn) if ld.churn is not None and not ld.churn.empty else 0
        rec_len = len(ld.recommendation) if ld.recommendation is not None and not ld.recommendation.empty else 0
        
        print(f"Sales rows: {sales_len}")
        print(f"Forecast rows: {forecast_len}")
        print(f"Customer/Churn rows: {churn_len}")
        print(f"Recommendation rows: {rec_len}")
        
        if sales_len == 0 or forecast_len == 0 or churn_len == 0 or rec_len == 0:
            if dataset_id:
                update_dataset_status(dataset_id, "Failed")
            return jsonify({
                "success": False,
                "failed_stage": "Data Validation",
                "exception": "EmptyDataFrameError",
                "message": "One or more processed datasets returned 0 rows.",
                "stdout": result.stdout,
                "stderr": "",
                "traceback": "",
                "exit_code": 1
            }), 500

        if dataset_id:
            update_dataset_status(dataset_id, "Completed")
            
        import datetime
        return jsonify({
            "success": True,
            "dataset": dataset_id,
            "analysis_completed": True,
            "dashboard_ready": True,
            "processed_at": datetime.datetime.now().isoformat(),
            "metrics": {
                "sales_records": sales_len,
                "forecast_records": forecast_len,
                "customers": churn_len,
                "recommendations": rec_len
            },
            "output": result.stdout
        })
        
    except Exception as e:
        if dataset_id:
            update_dataset_status(dataset_id, "Failed")
        return jsonify({
            "success": False,
            "failed_stage": "Backend/Flask",
            "exception": type(e).__name__,
            "message": str(e),
            "stdout": "",
            "stderr": "",
            "traceback": "",
            "exit_code": 500
        }), 500
