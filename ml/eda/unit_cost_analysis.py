import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

unit = sales.groupby("Product_Category")["Unit_Cost"].mean()

print("="*60)
print("Unit Cost analysis")
print("="*60)

print(unit)