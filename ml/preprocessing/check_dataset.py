import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

# Load dataset
sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "uploaded.csv"))

print("=" * 50)
print("DATASET OVERVIEW")
print("=" * 50)

print(f"Rows: {sales.shape[0]}")
print(f"Columns: {sales.shape[1]}")

print("\nColumn Names:")
print(sales.columns.tolist())

print("\nData Types:")
print(sales.dtypes)

print("\nMissing Values:")
print(sales.isnull().sum())

print("\nDuplicate Rows:")
print(sales.duplicated().sum())