import pandas as pd
from sklearn.ensemble import RandomForestRegressor

sales = pd.read_csv("ml/data/processed/sales_processed.csv")

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