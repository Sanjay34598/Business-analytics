from flask import Blueprint, jsonify
from backend.services.load_data import sales

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/sales")
def get_sales():

    return jsonify(
        sales.head(100).to_dict(orient="records")
    )