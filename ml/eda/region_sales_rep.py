import os
import pandas as pd

sales=pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

sales_rep= sales.groupby(["Region","Sales_Rep"])["Sales_Amount"].sum()

print("="*50)
print("Region & Sales Rep Analysis")
print("="*50)

print(sales_rep)