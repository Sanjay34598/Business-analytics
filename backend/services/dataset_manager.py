import os
import json
import shutil
import uuid
from datetime import datetime

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_dir = os.path.join(base_dir, "backend", "data")
uploads_dir = os.path.join(data_dir, "uploads")
registry_file = os.path.join(data_dir, "datasets.json")
ml_raw_sales_file = os.path.join(base_dir, "ml", "data", "raw", "sales", "sales_data.csv")

def _load_registry():
    if not os.path.exists(registry_file):
        return []
    with open(registry_file, "r") as f:
        try:
            return json.load(f)
        except:
            return []

def _save_registry(data):
    with open(registry_file, "w") as f:
        json.dump(data, f, indent=4)

def get_datasets():
    return _load_registry()

def add_dataset(filename, file_content):
    dataset_id = str(uuid.uuid4())
    save_path = os.path.join(uploads_dir, f"{dataset_id}.csv")
    
    with open(save_path, "wb") as f:
        f.write(file_content)
        
    size_mb = round(os.path.getsize(save_path) / (1024 * 1024), 2)
    upload_date = datetime.now().strftime("%b %d, %Y, %I:%M %p")
    
    # Estimate rows/columns roughly by reading the first few lines
    rows = 0
    cols = 0
    with open(save_path, "r", encoding="utf-8", errors="ignore") as f:
        first_line = f.readline()
        if first_line:
            cols = len(first_line.split(","))
        for line in f:
            rows += 1
            
    dataset_info = {
        "id": dataset_id,
        "name": filename,
        "rows": rows,
        "columns": cols,
        "size": f"{size_mb} MB",
        "uploadDate": upload_date,
        "status": "Uploaded",
        "active": False
    }
    
    registry = _load_registry()
    registry.append(dataset_info)
    _save_registry(registry)
    
    return dataset_info

def set_active_dataset(dataset_id):
    registry = _load_registry()
    dataset_info = None
    
    for d in registry:
        if d["id"] == dataset_id:
            dataset_info = d
            d["active"] = True
        else:
            d["active"] = False
            
    if not dataset_info:
        raise ValueError("Dataset not found")
        
    source_path = os.path.join(uploads_dir, f"{dataset_id}.csv")
    if not os.path.exists(source_path):
        raise FileNotFoundError("Dataset file missing")
        
    os.makedirs(os.path.dirname(ml_raw_sales_file), exist_ok=True)
    shutil.copy2(source_path, ml_raw_sales_file)
    
    # Restore processed files, models, and reports if dataset was already completed
    dataset_runs_dir = os.path.join(data_dir, "analysis_runs", dataset_id)
    dataset_data_dir = os.path.join(dataset_runs_dir, "data")
    dataset_models_dir = os.path.join(dataset_runs_dir, "models")
    dataset_reports_dir = os.path.join(dataset_runs_dir, "reports")
    
    ml_processed_dir = os.path.join(base_dir, "ml", "data", "processed")
    ml_models_dir = os.path.join(base_dir, "ml", "data", "models")
    ml_reports_dir = os.path.join(base_dir, "ml", "data", "reports")
    
    if os.path.exists(dataset_data_dir):
        os.makedirs(ml_processed_dir, exist_ok=True)
        for f in os.listdir(dataset_data_dir):
            if f.endswith(".csv"):
                shutil.copy2(os.path.join(dataset_data_dir, f), os.path.join(ml_processed_dir, f))
                
    if os.path.exists(dataset_models_dir):
        os.makedirs(ml_models_dir, exist_ok=True)
        for f in os.listdir(dataset_models_dir):
            if f.endswith(".pkl"):
                shutil.copy2(os.path.join(dataset_models_dir, f), os.path.join(ml_models_dir, f))
                
    if os.path.exists(dataset_reports_dir):
        os.makedirs(ml_reports_dir, exist_ok=True)
        for f in os.listdir(dataset_reports_dir):
            shutil.copy2(os.path.join(dataset_reports_dir, f), os.path.join(ml_reports_dir, f))
    
    _save_registry(registry)
    return dataset_info

def update_dataset_status(dataset_id, status):
    registry = _load_registry()
    for d in registry:
        if d["id"] == dataset_id:
            d["status"] = status
            _save_registry(registry)
            return True
    return False

def delete_dataset(dataset_id):
    registry = _load_registry()
    dataset_info = None
    
    new_registry = []
    for d in registry:
        if d["id"] == dataset_id:
            dataset_info = d
        else:
            new_registry.append(d)
            
    if not dataset_info:
        raise ValueError("Dataset not found")
        
    _save_registry(new_registry)
    
    file_path = os.path.join(uploads_dir, f"{dataset_id}.csv")
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return dataset_info
