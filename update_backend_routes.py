import os

dashboard_bp_code = '''from flask import Blueprint, jsonify, request
import services.load_data as ld
from services.dataset_manager import get_config

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
@dashboard_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    analysis_id = request.args.get("analysis_id")
    if not analysis_id:
        config = get_config()
        analysis_id = config.get("active_analysis")
        
    if not analysis_id:
        return jsonify({
            "analysis": {"status": "No Active Dataset"},
            "metadata": {},
            "kpis": {},
            "sales": [],
            "forecast": [],
            "customers": [],
            "recommendations": [],
            "report": {}
        })
        
    data = ld.get_full_dashboard_data(analysis_id)
    return jsonify(data)
'''

sales_bp_code = '''from flask import Blueprint, jsonify, request
import services.load_data as ld

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/api/sales")
@sales_bp.route("/sales")
def get_sales():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'sales'))
'''

forecast_bp_code = '''from flask import Blueprint, jsonify, request
import services.load_data as ld

forecast_bp = Blueprint("forecast", __name__)

@forecast_bp.route("/api/forecast")
@forecast_bp.route("/forecast")
def get_forecast():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'forecast'))
'''

churn_bp_code = '''from flask import Blueprint, jsonify, request
import services.load_data as ld

churn_bp = Blueprint("churn", __name__)

@churn_bp.route("/api/churn")
@churn_bp.route("/churn")
def get_churn():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'customers'))
'''

recommendation_bp_code = '''from flask import Blueprint, jsonify, request
import services.load_data as ld

recommendation_bp = Blueprint("recommendation", __name__)

@recommendation_bp.route("/api/recommendation")
@recommendation_bp.route("/recommendation")
def get_recommendation():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'recommendations'))
'''

reports_bp_code = '''from flask import Blueprint, jsonify, request
import services.load_data as ld

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/api/report")
@reports_bp.route("/reports/metrics")
def get_metrics():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_metrics(analysis_id))
'''

with open('backend/routes/dashboard.py', 'w') as f:
    f.write(dashboard_bp_code)
    
with open('backend/routes/sales.py', 'w') as f:
    f.write(sales_bp_code)
    
with open('backend/routes/forecast.py', 'w') as f:
    f.write(forecast_bp_code)
    
with open('backend/routes/churn.py', 'w') as f:
    f.write(churn_bp_code)
    
with open('backend/routes/recommendation.py', 'w') as f:
    f.write(recommendation_bp_code)
    
with open('backend/routes/reports.py', 'w') as f:
    f.write(reports_bp_code)

print("Updated route blueprints!")
