import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

plt.hist(sales["Sales_Amount"],bins=20)

plt.title("Sales Distribution ")
plt.ylabel("Sales Amount")
plt.xlabel("Frequency")

plt.show()