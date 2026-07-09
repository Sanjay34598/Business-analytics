import pandas as pd

# Load dataset
sales = pd.read_csv("ml/data/raw/sales/sales_data.csv")

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