import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

encoder = LabelEncoder()

sales["Sales_Channel"] = encoder.fit_transform(
	sales["Sales_Channel"]
)

print(sales["Sales_Channel"].head())
print(encoder.classes_)