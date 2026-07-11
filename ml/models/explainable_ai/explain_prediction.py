import pandas as pd
importance =pd.read_csv("ml/data/processed/feature_importance.csv")

print("Top Importance Features")
print(importance.head())