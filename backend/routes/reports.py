import os
import json
from flask import Blueprint, jsonify

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/reports/metrics")
def get_metrics():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    metrics_path = os.path.join(base_dir, "ml", "data", "reports", "metrics.json")
    
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            try:
                metrics = json.load(f)
                
                # Attach file modification time as training date
                mtime = os.path.getmtime(metrics_path)
                from datetime import datetime
                metrics["training_date"] = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
                
                return jsonify(metrics)
            except:
                return jsonify({})
    return jsonify({})
