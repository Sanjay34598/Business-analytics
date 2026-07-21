import os
import pandas as pd
sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_processed.csv"))

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
	os.path.join(os.environ["ANALYSIS_DIR"], "processed", "product_recommend.csv")
)

import joblib

joblib.dump(recommend, os.path.join(os.environ["ANALYSIS_DIR"], "models", "recommendation_model.pkl"))

print("Saved Succesfully")