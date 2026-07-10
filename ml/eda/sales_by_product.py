import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

category_sales = sales.groupby("Product_Category")["Sales_Amount"].sum()

print(category_sales)