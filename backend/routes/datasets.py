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
        
        result = subprocess.run(
            ["python", "ml/pipeline/run_pipeline.py"],
            cwd=project_root,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            if dataset_id:
                update_dataset_status(dataset_id, "Error")
            
            stderr = result.stderr or ""
            stdout = result.stdout or ""
            
            # Simple heuristic to extract the failed stage
            import re
            failed_stage = "Unknown"
            stage_match = re.findall(r"Failed ([\w/.]+)", stdout + stderr)
            if stage_match:
                failed_stage = stage_match[-1]
                
            # Extract exception
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
            
        reload_data()
        
        if dataset_id:
            update_dataset_status(dataset_id, "Processed & Active")
            
        return jsonify({"success": True, "message": "Analysis completed successfully", "output": result.stdout})
        
    except Exception as e:
        if dataset_id:
            update_dataset_status(dataset_id, "Error")
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
