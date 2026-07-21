import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))

print("total sales")
print(sales["Sales_Amount"].sum())

print()

print("average sales")
print(sales["Sales_Amount"].mean())

print()

print("Highest sale")
print(sales["Sales_Amount"].max())

print()

print("Lowest sale")
print(sales["Sales_Amount"].min())