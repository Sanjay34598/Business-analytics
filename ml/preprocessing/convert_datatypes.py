import os
import pandas as pd

# Load dataset
sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "uploaded.csv"))

print("Before Conversion")
print(sales.dtypes)

# Convert Sale_Date
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

print("\nAfter Conversion")
print(sales.dtypes)