import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

print("="*50)
print("Basic Statistics")
print("="*50)

print(sales.describe())