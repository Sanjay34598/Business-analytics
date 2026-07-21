import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

quantity = sales.groupby("Product_Category")["Quantity_Sold"].sum()

print("="*50)
print("Product Analysis")
print("="*50)

print(quantity)