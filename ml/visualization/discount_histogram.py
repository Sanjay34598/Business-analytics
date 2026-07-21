import os
import pandas as pd
import matplotlib.pyplot as plt 

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

plt.hist(sales["Discount"],bins=10)

plt.title("Discount histogram")
plt.ylabel("Discount")
plt.xlabel("Frequency")

plt.show()