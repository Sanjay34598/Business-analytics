import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

region_sales = sales.groupby("Region")["Sales_Amount"].sum()

print(region_sales)