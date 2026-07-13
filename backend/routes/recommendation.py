from flask import Blueprint, jsonify
from backend.services.load_data import recommendation

recommend_bp = Blueprint("recommend", __name__)

@recommend_bp.route("/recommendation")
def get_recommendation():

    return jsonify(
        recommendation.to_dict(orient="records")
    )