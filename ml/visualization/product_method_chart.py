import os
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

payment = sales["Payment_Method"].value_counts()

payment.plot(kind="pie", autopct="%1.1f%%" )

plt.ylabel("")
plt.title("Payment method")

plt.show()