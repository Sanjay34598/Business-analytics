import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

sales = pd.read_csv("ml/data/processed/sales_processed.csv")

features = sales[
	[
		"Sales_Amount",
		"Quantity_Sold",
		"Profit",
		"Profit_Margin"
	]
]

scaler = StandardScaler()

scaled_features = scaler.fit_transform(features)

kmeans = KMeans(
	n_clusters=4,
	random_state=42,
	n_init=10
)
sales["Customer_Segment"]= kmeans.fit_predict(scaled_features)

print("="*60)
print("Clustered Centers")
print("="*60)

print(kmeans.cluster_centers_)

print(sales["Customer_Segment"].value_counts())

print("First 5 Rows")

print(
	sales[
		[
			"Sales_Amount",
			"Quantity_Sold",
			"Profit",
            "Profit_Margin",
			"Customer_Segment"
		]
	].head()
)

sales.to_csv(
	"ml/data/processed/sales_clustered.csv",
     index=False
)

print("Customer Segementation completed ")
