import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import json
import os
import pandas as pd
sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales.csv"))

recommend = (
	sales.groupby("Product_Category").agg(
		Average_Profit = ("Profit","mean"),
		Average_Sales = ("Sales_Amount","mean"),
		Total_Sold = ("Quantity_Sold","sum")
	)
)

recommend = recommend.sort_values(
	by="Average_Profit",
	ascending=False
) 

print("="*60)
print("Top Recommended product")
print("="*60)

print(recommend)

recommend.to_csv(
	os.path.join(os.environ["ANALYSIS_DIR"], "processed", "recommendations.csv")
)

import joblib

joblib.dump(recommend, os.path.join(os.environ["ANALYSIS_DIR"], "models", f"recommendation_{json.load(open(os.path.join(os.environ['ANALYSIS_DIR'], 'metadata.json')))['model_version']}.pkl"))

print("Saved Succesfully")