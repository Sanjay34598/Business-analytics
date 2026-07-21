from flask import Blueprint, jsonify, request
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
