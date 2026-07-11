import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

encoder = LabelEncoder()

sales["Payment_Method"]=encoder.fit_transform(
	sales["Payment_Method"]
)

print(sales["Payment_Method"].head())
print(encoder.classes_)