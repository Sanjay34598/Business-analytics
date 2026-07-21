import os

routes_code = {
    'sales.py': '''from flask import Blueprint, jsonify, request
import services.load_data as ld

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/sales")
def get_sales():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'sales'))
''',

    'forecast.py': '''from flask import Blueprint, jsonify, request
import services.load_data as ld

forecast_bp = Blueprint("forecast", __name__)

@forecast_bp.route("/forecast")
def get_forecast():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'forecast'))
''',

    'churn.py': '''from flask import Blueprint, jsonify, request
import services.load_data as ld

churn_bp = Blueprint("churn", __name__)

@churn_bp.route("/churn")
def get_churn():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'churn'))
''',

    'recommendation.py': '''from flask import Blueprint, jsonify, request
import services.load_data as ld

recommendation_bp = Blueprint("recommendation", __name__)

@recommendation_bp.route("/recommendation")
def get_recommendation():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'recommendation'))
''',

    'reports.py': '''from flask import Blueprint, jsonify, request
import services.load_data as ld

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/reports/metrics")
def get_metrics():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_metrics(analysis_id))
'''
}

for filename, content in routes_code.items():
    filepath = os.path.join('backend', 'routes', filename)
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'Updated {filepath}')
