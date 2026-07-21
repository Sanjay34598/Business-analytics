import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

sales=pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))

customer = sales.groupby("Customer_Type").agg(
	Total_Sales = ("Sales_Amount","sum"),
	Customers = ("Customer_Type","count") 
)

print("="*50)
print("Customer Analysis")
print("="*50)

print(customer)