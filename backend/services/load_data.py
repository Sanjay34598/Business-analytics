import pandas as pd
import os

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_dir = os.path.join(base_dir, "ml", "data", "processed")

sales = pd.read_csv(os.path.join(data_dir, "sales_processed.csv"))
forecast = pd.read_csv(os.path.join(data_dir, "forecast_results.csv"))
churn = pd.read_csv(os.path.join(data_dir, "churn_prediction.csv"))
recommendation = pd.read_csv(os.path.join(data_dir, "product_recommend.csv"))
segments = pd.read_csv(os.path.join(data_dir, "sales_clustered.csv"))

