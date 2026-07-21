from flask import Blueprint, jsonify
from services.load_data import churn

churn_bp = Blueprint("churn", __name__)

@churn_bp.route("/churn")
def get_churn():

    return jsonify(
        churn.to_dict(orient="records")
    )