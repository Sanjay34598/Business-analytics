import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import(
	accuracy_score,
	precision_score,
	recall_score,
	f1_score,
	confusion_matrix
)

sales = pd.read_csv("ml/data/processed/sales_processed.csv")

sales["Churn"] = (
	sales["Profit"]<0
).astype(int)

x = sales[
	[
		"Quantity_Sold",
        "Discount",
        "Customer_Type",
        "Sales_Channel",
        "Region",
        "Month"
	]
]

y = sales["Churn"]

x_train,x_test,y_train,y_test = train_test_split(
	x,
	y,
	test_size=0.20,
	random_state=42
)

import joblib
model = joblib.load("ml/data/models/churn_model.pkl")

prediction = model.predict(
	x_test
)

print("="*50)
print("Churn Model")
print("="*50)

acc = accuracy_score(y_test,prediction)
prec = precision_score(y_test,prediction)
rec = recall_score(y_test,prediction)
f1 = f1_score(y_test,prediction)
cm = confusion_matrix(y_test,prediction)

print("Accuracy :", acc)
print("precssion :", prec)
print("Recall Score :", rec)
print("F1 Score :", f1)
print("Confusion Matrix")
print(cm)

import os
import json
os.makedirs("ml/data/reports", exist_ok=True)

metrics = {}
if os.path.exists("ml/data/reports/metrics.json"):
    with open("ml/data/reports/metrics.json", "r") as f:
        metrics = json.load(f)

metrics["churn"] = {
    "Accuracy": acc,
    "Precision": prec,
    "Recall": rec,
    "F1": f1,
    "Confusion_Matrix": cm.tolist()
}

with open("ml/data/reports/metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)
