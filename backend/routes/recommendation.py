from flask import Blueprint, jsonify
import services.load_data as ld

recommend_bp = Blueprint("recommend", __name__)

@recommend_bp.route("/recommendation")
def get_recommendation():

    return jsonify(
        ld.recommendation.to_dict(orient="records")
    )