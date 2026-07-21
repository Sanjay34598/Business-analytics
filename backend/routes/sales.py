from flask import Blueprint, jsonify
import services.load_data as ld

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("/sales")
def get_sales():

    return jsonify(
        ld.sales.head(100).to_dict(orient="records")
    )