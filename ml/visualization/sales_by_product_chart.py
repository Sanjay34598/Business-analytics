import os
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

product = sales.groupby("Product_Category")["Sales_Amount"].sum()

product.plot(kind="bar")

plt.title("Product charts")
plt.xlabel("Category")
plt.ylabel("Sales")
plt.tight_layout()

plt.show()