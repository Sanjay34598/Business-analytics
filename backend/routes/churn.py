from flask import Blueprint, jsonify, request
import services.load_data as ld

churn_bp = Blueprint("churn", __name__)

@churn_bp.route("/api/churn")
@churn_bp.route("/churn")
def get_churn():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'customers'))
