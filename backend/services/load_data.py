import pandas as pd
import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
analysis_runs_dir = os.path.join(base_dir, "backend", "data", "analysis_runs")

def get_data(analysis_id, data_type):
    if not analysis_id:
        return []
        
    processed_dir = os.path.join(analysis_runs_dir, analysis_id, "processed")
    
    file_map = {
        "sales": "sales_processed.csv",
        "forecast": "forecast_results.csv",
        "churn": "churn_prediction.csv",
        "recommendation": "product_recommend.csv",
        "segments": "sales_clustered.csv"
    }
    
    if data_type not in file_map:
        return []
        
    file_path = os.path.join(processed_dir, file_map[data_type])
    
    if not os.path.exists(file_path):
        return []
        
    try:
        df = pd.read_csv(file_path)
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def get_metrics(analysis_id):
    if not analysis_id:
        return {}
        
    reports_dir = os.path.join(analysis_runs_dir, analysis_id, "reports")
    file_path = os.path.join(reports_dir, "metrics.json")
    
    if not os.path.exists(file_path):
        return {}
        
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return {}
