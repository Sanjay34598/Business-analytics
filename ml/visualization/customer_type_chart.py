import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

customer = sales["Customer_Type"].value_counts()

customer.plot(kind="pie",autopct="%1.1f%%")

plt.ylabel("")
plt.title("Customer Type")

plt.show()