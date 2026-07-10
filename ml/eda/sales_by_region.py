import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

region_sales = sales.groupby("Region")["Sales_Amount"].sum()

print(region_sales)