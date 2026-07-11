import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

encoder = LabelEncoder()

sales["Region"] = encoder.fit_transform(
	sales["Region"]
)

print(sales["Region"].head())
print(encoder.classes_)