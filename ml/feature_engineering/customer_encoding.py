import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

encoder = LabelEncoder()

sales["Customer_Type"] = encoder.fit_transform(
	sales["Customer_Type"]
)
print(sales["Customer_Type"].head())
print(encoder.classes_)