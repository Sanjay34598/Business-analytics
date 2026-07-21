import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

# Load dataset
sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "uploaded.csv"))

print("Before Conversion")
print(sales.dtypes)

# Convert Sale_Date
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

print("\nAfter Conversion")
print(sales.dtypes)