import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])
sales["Month"] = sales["Sale_Date"].dt.month_name()

monthly_sales = sales.groupby("Month")["Sales_Amount"].sum()

print("="*50)
print("Monthly Sales")
print("="*50)

print(monthly_sales)