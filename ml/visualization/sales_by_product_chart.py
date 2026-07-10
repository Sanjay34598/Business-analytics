import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

product = sales.groupby("Product_Category")["Sales_Amount"].sum()

product.plot(kind="bar")

plt.title("Product charts")
plt.xlabel("Category")
plt.ylabel("Sales")
plt.tight_layout()

plt.show()