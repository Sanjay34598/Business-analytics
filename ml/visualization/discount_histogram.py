import pandas as pd
import matplotlib.pyplot as plt 

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

plt.hist(sales["Discount"],bins=10)

plt.title("Discount histogram")
plt.ylabel("Discount")
plt.xlabel("Frequency")

plt.show()