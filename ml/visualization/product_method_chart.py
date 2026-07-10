import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

payment = sales["Payment_Method"].value_counts()

payment.plot(kind="pie", autopct="%1.1f%%" )

plt.ylabel("")
plt.title("Payment method")

plt.show()