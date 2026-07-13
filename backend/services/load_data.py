import pandas as pd

sales = pd.read_csv("ml/data/processed/sales_processed.csv")
forecast = pd.read_csv("ml/data/processed/forecast_results.csv")
churn = pd.read_csv("ml/data/processed/churn_prediction.csv")
recommendation = pd.read_csv("ml/data/processed/product_recommend.csv")
segments = pd.read_csv("ml/data/processed/sales_clustered.csv")

