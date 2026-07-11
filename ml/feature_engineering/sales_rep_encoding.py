import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

encoder = LabelEncoder()

sales["Sales_Rep"]=encoder.fit_transform(
	sales["Sales_Rep"]
)
print(sales["Sales_Rep"].head())
print(encoder.classes_)