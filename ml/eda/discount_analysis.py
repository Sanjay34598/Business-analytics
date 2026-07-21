import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

discount = sales.groupby("Discount")["Sales_Amount"].sum()

print("="*50)
print("Discount Analysis")
print("="*50)

print(discount)