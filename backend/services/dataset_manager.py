import os
import json
import shutil
from datetime import datetime

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_dir = os.path.join(base_dir, "backend", "data")
analysis_runs_dir = os.path.join(data_dir, "analysis_runs")
registry_file = os.path.join(data_dir, "datasets.json")
config_file = os.path.join(data_dir, "config.json")

def _load_json(file_path, default):
    if not os.path.exists(file_path):
        return default
    with open(file_path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return default

def _save_json(file_path, data):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def get_config():
    return _load_json(config_file, {"active_analysis": None})

def set_active_analysis(analysis_id):
    config = get_config()
    config["active_analysis"] = analysis_id
    _save_json(config_file, config)
    
    # Update last_opened in metadata
    meta = get_analysis_metadata(analysis_id)
    if meta:
        meta["last_opened"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        save_analysis_metadata(analysis_id, meta)
    return config

def get_datasets():
    return _load_json(registry_file, [])

def _save_registry(registry):
    _save_json(registry_file, registry)

def generate_next_analysis_id():
    registry = get_datasets()
    existing_nums = []
    for item in registry:
        aid = item.get("analysis_id") or item.get("id") or ""
        if aid.startswith("analysis_"):
            try:
                num = int(aid.replace("analysis_", ""))
                existing_nums.append(num)
            except ValueError:
                pass
                
    # Also check directories on disk
    if os.path.exists(analysis_runs_dir):
        for folder in os.listdir(analysis_runs_dir):
            if folder.startswith("analysis_"):
                try:
                    num = int(folder.replace("analysis_", ""))
                    existing_nums.append(num)
                except ValueError:
                    pass
                    
    next_num = max(existing_nums, default=0) + 1
    return f"analysis_{next_num:03d}"

def get_analysis_dir(analysis_id):
    return os.path.join(analysis_runs_dir, analysis_id)

def get_analysis_metadata(analysis_id):
    meta_path = os.path.join(get_analysis_dir(analysis_id), "metadata.json")
    return _load_json(meta_path, None)

def save_analysis_metadata(analysis_id, metadata):
    meta_path = os.path.join(get_analysis_dir(analysis_id), "metadata.json")
    _save_json(meta_path, metadata)
    
    # Sync with registry
    registry = get_datasets()
    found = False
    for item in registry:
        if item.get("analysis_id") == analysis_id or item.get("id") == analysis_id:
            item["analysis_id"] = analysis_id
            item["id"] = analysis_id
            item["dataset_name"] = metadata.get("dataset_name", item.get("dataset_name", ""))
            item["name"] = item["dataset_name"]
            item["status"] = metadata.get("status", item.get("status", "Uploaded"))
            item["rows"] = metadata.get("rows", item.get("rows", 0))
            item["columns"] = metadata.get("columns", item.get("columns", 0))
            item["created_at"] = metadata.get("uploaded_at", item.get("created_at", ""))
            item["uploadDate"] = item["created_at"]
            item["model_version"] = metadata.get("model_version", "v1")
            item["accuracy"] = metadata.get("forecast_accuracy", "N/A")
            found = True
            break
            
    if not found:
        registry.append({
            "analysis_id": analysis_id,
            "id": analysis_id,
            "dataset_name": metadata.get("dataset_name", ""),
            "name": metadata.get("dataset_name", ""),
            "created_at": metadata.get("uploaded_at", ""),
            "uploadDate": metadata.get("uploaded_at", ""),
            "status": metadata.get("status", "Uploaded"),
            "rows": metadata.get("rows", 0),
            "columns": metadata.get("columns", 0),
            "model_version": metadata.get("model_version", "v1"),
            "accuracy": metadata.get("forecast_accuracy", "N/A")
        })
        
    _save_registry(registry)

def add_dataset(filename, file_content):
    analysis_id = generate_next_analysis_id()
    run_dir = get_analysis_dir(analysis_id)
    
    # Create subfolder structure according to Phase 2 spec
    dataset_dir = os.path.join(run_dir, "dataset")
    processed_dir = os.path.join(run_dir, "processed")
    models_dir = os.path.join(run_dir, "models")
    reports_dir = os.path.join(run_dir, "reports")
    charts_dir = os.path.join(reports_dir, "charts")
    logs_dir = os.path.join(run_dir, "logs")
    
    for d in [dataset_dir, processed_dir, models_dir, reports_dir, charts_dir, logs_dir]:
        os.makedirs(d, exist_ok=True)
        
    # Save raw uploaded file to dataset/uploaded.csv
    save_path = os.path.join(dataset_dir, "uploaded.csv")
    with open(save_path, "wb") as f:
        f.write(file_content)
        
    uploaded_at = datetime.now().strftime("%b %d, %Y, %I:%M %p")
    
    # Calculate rows & columns
    rows = 0
    cols = 0
    with open(save_path, "r", encoding="utf-8", errors="ignore") as f:
        first_line = f.readline()
        if first_line:
            cols = len(first_line.split(","))
        for _ in f:
            rows += 1

    metadata = {
        "analysis_id": analysis_id,
        "dataset_name": filename,
        "status": "Uploaded",
        "rows": rows,
        "columns": cols,
        "uploaded_at": uploaded_at,
        "trained_at": "Not Trained",
        "forecast_accuracy": "N/A",
        "churn_accuracy": "N/A",
        "recommendation_score": "N/A",
        "algorithm": "Linear Regression / Random Forest",
        "model_version": "v1",
        "training_time": "0s",
        "processing_time": "0s",
        "last_opened": uploaded_at
    }
    
    save_analysis_metadata(analysis_id, metadata)
    set_active_analysis(analysis_id)
    
    return {
        "analysis_id": analysis_id,
        "id": analysis_id,
        "name": filename,
        "rows": rows,
        "columns": cols,
        "uploadDate": uploaded_at,
        "status": "Uploaded",
        "model_version": "v1"
    }

def update_dataset_status(analysis_id, status, extra_meta=None):
    meta = get_analysis_metadata(analysis_id)
    if meta:
        meta["status"] = status
        if extra_meta:
            meta.update(extra_meta)
        save_analysis_metadata(analysis_id, meta)
        return True
    return False

def delete_dataset(analysis_id):
    registry = get_datasets()
    new_registry = [d for d in registry if d.get("analysis_id") != analysis_id and d.get("id") != analysis_id]
    _save_registry(new_registry)
    
    run_dir = get_analysis_dir(analysis_id)
    if os.path.exists(run_dir):
        shutil.rmtree(run_dir, ignore_errors=True)
        
    config = get_config()
    if config.get("active_analysis") == analysis_id:
        next_active = new_registry[0].get("analysis_id") if new_registry else None
        set_active_analysis(next_active)
        
    return True
