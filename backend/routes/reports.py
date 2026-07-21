from flask import Blueprint, jsonify, request
import services.load_data as ld

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/api/report")
@reports_bp.route("/reports/metrics")
def get_metrics():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_metrics(analysis_id))
