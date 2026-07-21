from flask import Blueprint, jsonify
import services.load_data as ld

churn_bp = Blueprint("churn", __name__)

@churn_bp.route("/churn")
def get_churn():

    return jsonify(
        ld.churn.to_dict(orient="records")
    )