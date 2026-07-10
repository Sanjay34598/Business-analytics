import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

channel = sales["Sales_Channel"].value_counts()

channel.plot(kind="pie",autopct="%1.1f%%")

plt.ylabel("")
plt.title("Sales Channel ")

plt.show()