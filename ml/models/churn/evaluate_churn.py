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
    ["Discount",
	"Quantity_Sold",
	"Customer_Type",
	"Region",
	"Sales_Channel",
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

model = DecisionTreeClassifier(
	random_state=42
)

model.fit(x_train,y_train)

prediction = model.predict(
	x_test
)

print("="*50)
print("Churn Model")
print("="*50)

print("Accuracy :",accuracy_score(y_test,prediction))
print("precssion :",precision_score(y_test,prediction))
print("Recall Score :",recall_score(y_test,prediction))
print("F1 Score :",f1_score(y_test,prediction))
print("Confusion Matrix")
print(confusion_matrix(y_test,prediction))
