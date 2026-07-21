from flask import Blueprint, jsonify, request
import services.load_data as ld

recommendation_bp = Blueprint("recommendation", __name__)

@recommendation_bp.route("/api/recommendation")
@recommendation_bp.route("/recommendation")
def get_recommendation():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'recommendations'))
