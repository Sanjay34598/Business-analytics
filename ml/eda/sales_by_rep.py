import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

sales_rep = sales.groupby("Sales_Rep")["Sales_Amount"].sum()

print(sales_rep)