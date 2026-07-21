import os
import json
import pandas as pd
from functools import lru_cache
from services.dataset_manager import get_analysis_dir, get_analysis_metadata

# Custom in-memory dictionary cache with invalidation
_data_cache = {}

def invalidate_cache(analysis_id=None):
    global _data_cache
    if analysis_id:
        keys_to_del = [k for k in _data_cache if k.startswith(f"{analysis_id}:")]
        for k in keys_to_del:
            del _data_cache[k]
    else:
        _data_cache.clear()

def get_data(analysis_id, data_type):
    if not analysis_id:
        return []
        
    cache_key = f"{analysis_id}:{data_type}"
    if cache_key in _data_cache:
        return _data_cache[cache_key]
        
    run_dir = get_analysis_dir(analysis_id)
    processed_dir = os.path.join(run_dir, "processed")
    
    file_map = {
        "sales": "sales.csv",
        "forecast": "forecast.csv",
        "churn": "customers.csv",
        "customers": "customers.csv",
        "recommendation": "recommendations.csv",
        "recommendations": "recommendations.csv",
        "segments": "customer_segment_summary.csv"
    }
    
    if data_type not in file_map:
        return []
        
    file_path = os.path.join(processed_dir, file_map[data_type])
    if not os.path.exists(file_path):
        return []
        
    try:
        df = pd.read_csv(file_path)
        # Handle NaN values to prevent JSON serialization errors
        records = df.fillna("").to_dict(orient="records")
        _data_cache[cache_key] = records
        return records
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def get_metrics(analysis_id):
    if not analysis_id:
        return {}
        
    cache_key = f"{analysis_id}:metrics"
    if cache_key in _data_cache:
        return _data_cache[cache_key]
        
    reports_dir = os.path.join(get_analysis_dir(analysis_id), "reports")
    file_path = os.path.join(reports_dir, "metrics.json")
    
    if not os.path.exists(file_path):
        return {}
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            _data_cache[cache_key] = data
            return data
    except Exception as e:
        print(f"Error reading metrics for {analysis_id}: {e}")
        return {}

def calculate_kpis(sales_data, forecast_data, churn_data, rec_data):
    total_sales = 0.0
    total_orders = len(sales_data)
    avg_order_value = 0.0
    total_profit = 0.0
    
    if sales_data:
        total_sales = sum(float(r.get("Sales_Amount", 0) or 0) for r in sales_data)
        total_profit = sum(float(r.get("Profit", 0) or 0) for r in sales_data)
        avg_order_value = round(total_sales / total_orders, 2) if total_orders > 0 else 0.0
        
    churn_risk_count = 0
    if churn_data:
        churn_risk_count = sum(1 for r in churn_data if str(r.get("Churn_Risk", "")).lower() in ["high", "1", "true"])
        
    return {
        "total_sales": round(total_sales, 2),
        "total_orders": total_orders,
        "avg_order_value": avg_order_value,
        "total_profit": round(total_profit, 2),
        "total_customers": len(churn_data),
        "churn_risk_count": churn_risk_count,
        "forecast_horizon": len(forecast_data),
        "recommendations_generated": len(rec_data)
    }

def get_full_dashboard_data(analysis_id):
    metadata = get_analysis_metadata(analysis_id) or {}
    sales = get_data(analysis_id, "sales")
    forecast = get_data(analysis_id, "forecast")
    customers = get_data(analysis_id, "customers")
    recommendations = get_data(analysis_id, "recommendations")
    metrics = get_metrics(analysis_id)
    
    kpis = calculate_kpis(sales, forecast, customers, recommendations)
    
    return {
        "analysis": {
            "analysis_id": analysis_id,
            "status": metadata.get("status", "Uploaded"),
            "dataset_name": metadata.get("dataset_name", ""),
            "model_version": metadata.get("model_version", "v1")
        },
        "metadata": metadata,
        "kpis": kpis,
        "sales": sales,
        "forecast": forecast,
        "customers": customers,
        "recommendations": recommendations,
        "report": metrics
    }
