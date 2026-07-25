# Machine Learning Pipeline Architecture

The Machine Learning engine inside the **Business Analytics Platform** provides automated data cleaning, feature extraction, time-series forecasting, customer RFM clustering, churn risk probability scoring, and market basket recommendation generation.

---

## Pipeline Execution Stages

```
┌───────────────────────────┐
│     Raw Transaction CSV   │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 1. Schema Check & Preproc │  Validate headers, handle missing values & date parsing
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 2. Feature Engineering    │  Derive profit margins, unit costs, temporal encodings
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│ 3a. Time-Series Forecast  │ 3b. Customer Segmentation │ 3c. Recommendation Engine │
│ (Lag Regression + Bounds) │ (RFM + K-Means Cluster)   │ (Basket Support/Lift)     │
└─────────────┬─────────────┴─────────────┬─────────────┴─────────────┬─────────────┘
              │                           │                           │
              └───────────────────────────┼───────────────────────────┘
                                          │
                                          ▼
                            ┌───────────────────────────┐
                            │ 4. Output Artifacts &     │  Write summary.json, forecast.json,
                            │    Precomputed Metrics    │  churn.json & report.pdf
                            └───────────────────────────┘
```

---

## Algorithms & Models Technical Specifications

### 1. Sales Forecasting Engine
- **Methodology**: Time-series regression using historical monthly aggregates and lag features.
- **Confidence Intervals**: 95% upper and lower prediction bounds calculated from residual standard errors.
- **Metrics**: MAE (Mean Absolute Error), RMSE (Root Mean Squared Error), MAPE (Mean Absolute Percentage Error).

### 2. RFM Customer Segmentation & Churn
- **RFM Metric Calculation**: Recency (days since last purchase), Frequency (total orders), Monetary (total spend).
- **Clustering**: K-Means (`n_clusters=4`, `StandardScaler`).
- **Churn Model**: Random Forest classifier predicting churn probability based on recency deceleration.

### 3. Product Association Recommendation
- **Methodology**: Market Basket Analysis evaluating product pair co-occurrences.
- **Metrics**: Support, Confidence, and Lift.
