import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_clustered.csv"))

print("="*50)
print("Cluster summary")
print("="*50)

summary = sales.groupby("Customer_Segment").agg(
	Customers = ("Customer_Segment","count"),
	Average_Sales = ("Sales_Amount","mean"),
	Average_Profit=("Profit","mean"),
	Average_Quantity=("Quantity_Sold","mean")
)

print(summary)

summary.to_csv(
	os.path.join(os.environ["ANALYSIS_DIR"], "processed", "customer_segment_summary.csv")
)

print("Summary Saved Succesfully")