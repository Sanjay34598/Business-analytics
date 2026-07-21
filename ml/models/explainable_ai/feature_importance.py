import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales.csv"))

X = sales[
    [
        "Quantity_Sold",
        "Unit_Price",
        "Profit",
        "Discount",
        "Month",
        "Region",
        "Product_Category",
        "Sales_Channel",
        "Customer_Type"
    ]
]

y = sales["Sales_Amount"]

model = RandomForestRegressor(
    random_state=42
)

model.fit(X, y)

importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print("="*60)
print("Feature Importance")
print("="*60)

print(importance)

importance.to_csv(
    "ml/data/processed/feature_importance.csv",
    index=False
)

print("\nSaved Successfully")