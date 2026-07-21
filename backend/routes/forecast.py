from flask import Blueprint, jsonify, request
import services.load_data as ld

forecast_bp = Blueprint("forecast", __name__)

@forecast_bp.route("/forecast")
def get_forecast():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'forecast'))
