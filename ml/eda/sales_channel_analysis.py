import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))
channel = sales.groupby("Sales_Channel").agg(
	Total_Sales=("Sales_Amount","sum"),
	Orders = ("Sales_Channel","count")
)

print("="*50)
print("Sales Channel Analysis")
print("="*50)

print(channel)