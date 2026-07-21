from flask import Blueprint, jsonify
import services.load_data as ld

recommendation_bp = Blueprint("recommendation", __name__)

@recommendation_bp.route("/recommendation")
def get_recommendation():

    return jsonify(
        ld.recommendation.to_dict(orient="records")
    )