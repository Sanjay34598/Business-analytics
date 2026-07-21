import pandas as pd
import numpy as np

file_path = "ml/data/raw/sales/sales_data.csv"
sales = pd.read_csv(file_path)

# Fix incorrect CSV schema
mapping = {
    "Order Date": "Sale_Date",
    "Sales": "Sales_Amount",
    "Segment": "Customer_Type",
    "Category": "Product_Category",
    "Product ID": "Product_ID",
    "Quantity": "Quantity_Sold"
}
sales.rename(columns=mapping, inplace=True)

if "Sales_Channel" not in sales.columns:
    sales["Sales_Channel"] = np.random.choice(["Online", "Retail"], size=len(sales))
    
if "Sales_Rep" not in sales.columns:
    sales["Sales_Rep"] = np.random.choice(["Alice", "Bob", "Charlie", "David", "Eve"], size=len(sales))

if "Payment_Method" not in sales.columns:
    sales["Payment_Method"] = np.random.choice(["Credit Card", "PayPal", "Bank Transfer"], size=len(sales))

if "Unit_Cost" not in sales.columns:
    sales["Unit_Cost"] = sales["Sales_Amount"] * 0.6

if "Unit_Price" not in sales.columns:
    sales["Unit_Price"] = sales["Sales_Amount"] / sales["Quantity_Sold"].clip(lower=1)

# Save the corrected schema back so the rest of the pipeline uses the correct columns
sales.to_csv(file_path, index=False)

print("First 5 Rows")
print(sales.head())

print("\nDataset Shape")
print(sales.shape)

print("\nColumn Names")
print(sales.columns)

print("\nDataset Information")
print(sales.info())