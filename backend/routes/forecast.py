from flask import Blueprint, jsonify
import services.load_data as ld

forecast_bp = Blueprint("forecast", __name__)

@forecast_bp.route("/forecast")
def get_forecast():

    return jsonify(
        ld.forecast.to_dict(orient="records")
    )