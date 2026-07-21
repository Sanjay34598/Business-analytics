import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))

sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])
sales["Month"] = sales["Sale_Date"].dt.month_name()

monthly_sales = sales.groupby("Month")["Sales_Amount"].sum()

print("="*50)
print("Monthly Sales")
print("="*50)

print(monthly_sales)