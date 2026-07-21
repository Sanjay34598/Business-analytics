import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

sales_rep = sales.groupby("Sales_Rep")["Sales_Amount"].sum()

print(sales_rep)