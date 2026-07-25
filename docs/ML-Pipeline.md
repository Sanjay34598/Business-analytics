# Machine Learning Pipeline Architecture

The **Business Analytics Platform** features a modular Python ML engine capable of executing end-to-end data processing, feature engineering, predictive modeling, customer segmentation, and automated business report generation.

---

## Pipeline Overview Workflow

```
┌───────────────────────────┐
│     Raw Transaction CSV   │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 1. Data Cleaning & Preproc│ ─── Check Nulls, Data Types, Negative Values
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 2. Feature Engineering    │ ─── Date Features, Profit Margins, Encodings
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│ 3a. Forecasting Engine    │ 3b. Customer Segmentation │ 3c. Recommendation Engine │
│ (Time-Series Linear/RF)   │ (RFM + K-Means Cluster)   │ (Market Basket / Rules)   │
└─────────────┬─────────────┴─────────────┬─────────────┴─────────────┬─────────────┘
              │                           │                           │
              └───────────────────────────┼───────────────────────────┘
                                          │
                                          ▼
                            ┌───────────────────────────┐
                            │ 4. Model Persistence &    │ ─── Write JSON Metrics &
                            │    Precomputed Cache      │     ReportLab PDF Reports
                            └───────────────────────────┘
```

---

## 1. Preprocessing Modules (`ml/preprocessing/`)

- **`check_dataset.py`**: Verifies required CSV headers (`Order ID`, `Sale_Date`, `Sales_Amount`, `Quantity_Sold`, `Profit`, `Customer ID`).
- **`convert_datatypes.py`**: Converts date strings to `datetime64[ns]`, parses numeric columns safely handling missing or formatted currency strings.
- **`load_sales_data.py`**: Reads CSV raw content into Pandas DataFrames and isolates invalid rows.
- **`save_cleaned_data.py`**: Serializes sanitized DataFrames for downstream feature extractors.

---

## 2. Feature Engineering (`ml/feature_engineering/`)

- **`date_features.py`**: Extracts temporal indicators including `Year`, `Month`, `DayOfWeek`, `Quarter`, `IsWeekend`, and `DaysSincePriorOrder`.
- **`profit_calculation.py` & `profit_margin.py`**: Computes unit cost variances, total gross profit, and margin percentages per transaction.
- **`customer_encoding.py` & `region_encoding.py`**: Performs ordinal and target encodings for categorical fields (`Customer_Type`, `Region`, `Sales_Channel`, `Payment_Method`).

---

## 3. Machine Learning Models (`ml/models/`)

### A. Sales Forecasting (`ml/models/forecasting/`)
- **Objective**: Predict future monthly aggregate sales.
- **Methodology**: Aggregates historical transactions by month, trains a lag-based regression model (Linear Regression / Random Forest Regressor), and computes 95% confidence prediction intervals.
- **Metrics Evaluated**: MAE (Mean Absolute Error), RMSE (Root Mean Squared Error), MAPE (Mean Absolute Percentage Error).

### B. Customer Segmentation & Churn (`ml/models/segmentation/` & `ml/models/churn/`)
- **RFM Analysis**: Evaluates Recency, Frequency, and Monetary value per customer ID.
- **Clustering**: Applies **K-Means Clustering** (`StandardScaler` + `KMeans(n_clusters=4)`) to group customers into segments (*VIP / High Value*, *Regular Loyal*, *At-Risk*, *Lost*).
- **Churn Risk Model**: Calculates churn risk probabilities using Random Forest / XGBoost classifiers based on order recency trends and order value decline.

### C. Recommendation Engine (`ml/models/recommendation/`)
- **Methodology**: Association Rule Mining on product basket co-occurrences.
- **Metrics**: Computes Support, Confidence, and Lift metrics for product pairs to generate cross-selling suggestions.

---

## 4. Pipeline Execution Script (`ml/pipeline/run_pipeline.py`)

The pipeline runner can be executed directly via command line or triggered programmatically by the Flask API:

```bash
python ml/pipeline/run_pipeline.py --data sample_datasets/Medium.csv --analysis-id test_run_01
```

### Options:
- `--data`: Path to input dataset CSV.
- `--analysis-id`: Unique identifier for isolating output artifacts in `backend/data/analysis_runs/<analysis-id>/`.
- `--output-dir`: Custom output destination directory (optional).

---

## 5. Artifact Output Schema

When `run_pipeline.py` finishes, it writes standard structured outputs to `backend/data/analysis_runs/<analysis-id>/`:

- `summary.json`: Executive KPIs, total metrics, regional & category distributions.
- `forecast.json`: Historical date-sales points + future forecasted values.
- `recommendation.json`: Formatted association rules list.
- `churn.json`: Segment counts and high-risk customer lists.
- `report.pdf`: Auto-compiled executive report PDF created via ReportLab canvas.
