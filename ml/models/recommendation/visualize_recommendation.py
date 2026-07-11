import pandas as pd
import matplotlib.pyplot as plt

recommend = pd.read_csv("ml/data/processed/product_recommend.csv")

plt.figure(figsize=(8,5))

plt.bar(
	recommend["Product_Category"],
	recommend["Average_Profit"]
)
plt.title("Product Recommendation")
plt.xlabel("category")
plt.ylabel("Average profit")

plt.tight_layout()
plt.show()