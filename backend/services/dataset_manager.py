import os
import json
import shutil
import uuid
from datetime import datetime

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_dir = os.path.join(base_dir, "backend", "data")
analysis_runs_dir = os.path.join(data_dir, "analysis_runs")
registry_file = os.path.join(data_dir, "datasets.json")

def _load_registry():
    if not os.path.exists(registry_file):
        return []
    with open(registry_file, "r") as f:
        try:
            return json.load(f)
        except:
            return []

def _save_registry(data):
    os.makedirs(data_dir, exist_ok=True)
    with open(registry_file, "w") as f:
        json.dump(data, f, indent=4)

def get_datasets():
    return _load_registry()

def add_dataset(filename, file_content):
    # Generate unique analysis ID
    dataset_id = "analysis_" + str(uuid.uuid4())[:8]
    
    # Create isolated folder structure
    run_dir = os.path.join(analysis_runs_dir, dataset_id)
    os.makedirs(run_dir, exist_ok=True)
    os.makedirs(os.path.join(run_dir, "processed"), exist_ok=True)
    os.makedirs(os.path.join(run_dir, "models"), exist_ok=True)
    os.makedirs(os.path.join(run_dir, "reports"), exist_ok=True)
    
    # Save raw uploaded file
    save_path = os.path.join(run_dir, "uploaded.csv")
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
        for _ in f:
            rows += 1
            
    dataset_info = {
        "id": dataset_id,
        "name": filename,
        "rows": rows,
        "columns": cols,
        "size": f"{size_mb} MB",
        "uploadDate": upload_date,
        "trainingDate": "Not Trained",
        "status": "Uploaded"
    }
    
    registry = _load_registry()
    registry.append(dataset_info)
    _save_registry(registry)
    
    return dataset_info

def update_dataset_status(dataset_id, status, training_date=None):
    registry = _load_registry()
    for d in registry:
        if d["id"] == dataset_id:
            d["status"] = status
            if training_date:
                d["trainingDate"] = training_date
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
    
    run_dir = os.path.join(analysis_runs_dir, dataset_id)
    if os.path.exists(run_dir):
        shutil.rmtree(run_dir, ignore_errors=True)
        
    return dataset_info

def set_active_dataset(dataset_id):
    registry = _load_registry()
    dataset_info = None
    
    for d in registry:
        if d["id"] == dataset_id:
            d["active"] = True
            dataset_info = d
        else:
            d["active"] = False
            
    if not dataset_info:
        raise ValueError("Dataset not found")
        
    # Check if we are using the new analysis_runs structure or old uploads structure
    new_source_path = os.path.join(analysis_runs_dir, dataset_id, "uploaded.csv")
    old_source_path = os.path.join(data_dir, "uploads", dataset_id + ".csv")
    
    if os.path.exists(new_source_path):
        source_path = new_source_path
    elif os.path.exists(old_source_path):
        source_path = old_source_path
    else:
        # Fallback just in case
        source_path = old_source_path
        
    ml_raw_sales_file = os.path.join(base_dir, "ml", "data", "raw", "sales", "sales_data.csv")
    os.makedirs(os.path.dirname(ml_raw_sales_file), exist_ok=True)
    if os.path.exists(source_path):
        shutil.copy2(source_path, ml_raw_sales_file)
    
    # Restore processed files if dataset was already completed
    dataset_processed_dir = os.path.join(data_dir, "processed", dataset_id)
    ml_processed_dir = os.path.join(base_dir, "ml", "data", "processed")
    if os.path.exists(dataset_processed_dir):
        os.makedirs(ml_processed_dir, exist_ok=True)
        for f in os.listdir(dataset_processed_dir):
            if f.endswith(".csv"):
                shutil.copy2(os.path.join(dataset_processed_dir, f), os.path.join(ml_processed_dir, f))
    
    _save_registry(registry)
    return dataset_info
