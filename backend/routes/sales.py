from flask import Blueprint, jsonify, request
import services.load_data as ld

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/sales")
def get_sales():
    analysis_id = request.args.get('analysis_id')
    return jsonify(ld.get_data(analysis_id, 'sales'))
