import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

category_sales = sales.groupby("Product_Category")["Sales_Amount"].sum()

print(category_sales)