import pandas as pd

# Load dataset
sales = pd.read_csv("ml/data/raw/sales/sales_data.csv")

print("Before Conversion")
print(sales.dtypes)

# Convert Sale_Date
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

print("\nAfter Conversion")
print(sales.dtypes)