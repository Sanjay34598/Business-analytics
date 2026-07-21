import pandas as pd
import os

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_dir = os.path.join(base_dir, "ml", "data", "processed")

# Initialize global variables
sales = None
forecast = None
churn = None
recommendation = None
segments = None

def reload_data():
    global sales, forecast, churn, recommendation, segments
    try:
        sales = pd.read_csv(os.path.join(data_dir, "sales_processed.csv"))
    except:
        sales = pd.DataFrame()
        
    try:
        forecast = pd.read_csv(os.path.join(data_dir, "forecast_results.csv"))
    except:
        forecast = pd.DataFrame()
        
    try:
        churn = pd.read_csv(os.path.join(data_dir, "churn_prediction.csv"))
    except:
        churn = pd.DataFrame()
        
    try:
        recommendation = pd.read_csv(os.path.join(data_dir, "product_recommend.csv"))
    except:
        recommendation = pd.DataFrame()
        
    try:
        segments = pd.read_csv(os.path.join(data_dir, "sales_clustered.csv"))
    except:
        segments = pd.DataFrame()

# Load data initially
reload_data()


