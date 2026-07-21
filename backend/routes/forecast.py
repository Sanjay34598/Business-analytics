from flask import Blueprint, jsonify
from services.load_data import forecast

forecast_bp = Blueprint("forecast", __name__)

@forecast_bp.route("/forecast")
def get_forecast():

    return jsonify(
        forecast.to_dict(orient="records")
    )