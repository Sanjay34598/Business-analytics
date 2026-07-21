from flask import Blueprint, request, jsonify
import os
import subprocess
import datetime
from services.dataset_manager import get_datasets, add_dataset, delete_dataset, update_dataset_status

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

@datasets_bp.route("/datasets/<dataset_id>/retrain", methods=["POST"])
def retrain_dataset(dataset_id):
    try:
        return analyze_dataset_core(dataset_id)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
        
@datasets_bp.route("/datasets/<dataset_id>", methods=["DELETE"])
def remove_dataset(dataset_id):
    try:
        dataset_info = delete_dataset(dataset_id)
        return jsonify({"message": "Dataset deleted successfully", "dataset": dataset_info})
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def analyze_dataset_core(dataset_id):
    if dataset_id:
        update_dataset_status(dataset_id, "Processing...")
        
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(os.path.dirname(current_dir))
        
        # Determine analysis directory
        analysis_dir = os.path.join(project_root, "backend", "data", "analysis_runs", dataset_id)
        
        if not os.path.exists(analysis_dir):
            return jsonify({"success": False, "message": "Dataset analysis directory missing"}), 404
        
        env = os.environ.copy()
        env["ANALYSIS_DIR"] = analysis_dir

        result = subprocess.run(
            ["python", "ml/pipeline/run_pipeline.py"],
            cwd=project_root,
            capture_output=True,
            text=True,
            env=env
        )
        
        if result.returncode != 0:
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
            
        # Verify output files in the analysis directory
        processed_dir = os.path.join(analysis_dir, "processed")
        required_files = [
            "sales_processed.csv",
            "forecast_results.csv",
            "churn_prediction.csv",
            "product_recommend.csv"
        ]
        
        for f in required_files:
            file_path = os.path.join(processed_dir, f)
            if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
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
                
        # Validate data by checking row counts
        import pandas as pd
        try:
            sales_df = pd.read_csv(os.path.join(processed_dir, "sales_processed.csv"))
            forecast_df = pd.read_csv(os.path.join(processed_dir, "forecast_results.csv"))
            churn_df = pd.read_csv(os.path.join(processed_dir, "churn_prediction.csv"))
            rec_df = pd.read_csv(os.path.join(processed_dir, "product_recommend.csv"))
            
            sales_len = len(sales_df)
            forecast_len = len(forecast_df)
            churn_len = len(churn_df)
            rec_len = len(rec_df)
        except Exception as e:
            sales_len = forecast_len = churn_len = rec_len = 0

        if sales_len == 0 or forecast_len == 0 or churn_len == 0 or rec_len == 0:
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

        training_date = datetime.datetime.now().strftime("%b %d, %Y, %I:%M %p")
        update_dataset_status(dataset_id, "Completed", training_date=training_date)
            
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
        update_dataset_status(dataset_id, "Failed")
        import traceback
        return jsonify({
            "success": False,
            "failed_stage": "Backend/Flask",
            "exception": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500

@datasets_bp.route("/datasets/analyze", methods=["POST"])
def analyze_dataset():
    data = request.json or {}
    dataset_id = data.get("dataset_id")
    return analyze_dataset_core(dataset_id)
