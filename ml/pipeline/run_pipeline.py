from utils import run

print("=" * 60)
print("BUSINESS ANALYTICS PIPELINE")
print("=" * 60)

run("ml/preprocessing/load_sales_data.py")

run("ml/preprocessing/check_dataset.py")

run("ml/preprocessing/convert_datatypes.py")

run("ml/preprocessing/save_cleaned_data.py")


run("ml/eda/basic_statistics.py")

run("ml/eda/business_summary.py")

run("ml/eda/sales_by_region.py")

run("ml/eda/sales_by_product.py")

run("ml/eda/sales_by_rep.py")


run("ml/feature_engineering/date_features.py")

run("ml/feature_engineering/profit_calculation.py")

run("ml/feature_engineering/profit_margin.py")

run("ml/feature_engineering/customer_encoding.py")

run("ml/feature_engineering/payment_encoding.py")

run("ml/feature_engineering/product_category_encoding.py")

run("ml/feature_engineering/region_encoding.py")

run("ml/feature_engineering/sales_encoding_channel.py")

run("ml/feature_engineering/save_processed_data.py")



run("ml/models/segmentation/customer_segmentation.py")

run("ml/models/segmentation/save_clustered_data.py")



run("ml/models/forecasting/forecast_sales.py")

run("ml/models/forecasting/evaluate_forecast.py")



run("ml/models/churn/churn_prediction.py")

run("ml/models/churn/evaluate_churn.py")



run("ml/models/recommendation/recommend_products.py")

run("ml/models/recommendation/evaluate_recommendation.py")


run("ml/models/explainable_ai/feature_importance.py")

run("ml/models/explainable_ai/explain_prediction.py")

run("ml/pipeline/generate_report.py")

print("=" * 60)
print("PIPELINE COMPLETED SUCCESSFULLY")
print("=" * 60)