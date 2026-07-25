# REST API Documentation

The **Business Analytics Platform** exposes a comprehensive RESTful API via Flask Blueprints. All endpoints return JSON responses and support CORS requests from the React frontend interface.

---

## Base URL

`http://127.0.0.1:5000`

---

## Endpoint Summary Table

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Datasets** | `/datasets` | `GET` | Retrieve list of all uploaded datasets. |
| **Datasets** | `/datasets/upload` | `POST` | Upload a new CSV dataset file. |
| **Datasets** | `/datasets/analyze` | `POST` | Execute ML analysis pipeline for a dataset. |
| **Datasets** | `/datasets/set-active` | `POST` | Switch active dataset for global views. |
| **Datasets** | `/datasets/<id>/retrain` | `POST` | Retrain ML pipeline and increment model version. |
| **Datasets** | `/datasets/<id>` | `DELETE` | Remove dataset file and associated analysis artifacts. |
| **Executive** | `/dashboard/kpis` | `GET` | Fetch top-level executive KPIs (Revenue, Profit, Orders, Margin). |
| **Sales** | `/sales/overview` | `GET` | Retrieve sales breakdown by channel, category, region, and time. |
| **Forecast** | `/forecast` | `GET` | Retrieve time-series historical & predicted sales forecast data. |
| **Churn** | `/churn` | `GET` | Fetch customer churn risk classification & retention metrics. |
| **Recommendations** | `/recommendation` | `GET` | Fetch product cross-selling & association rules. |
| **Reports** | `/reports/summary` | `GET` | Retrieve executive textual summary and key highlights. |

---

## Endpoint Details & Payload Specifications

### 1. Datasets Management

#### `GET /datasets`
Retrieves all registered datasets in the system.

**Response `200 OK`**:
```json
[
  {
    "id": "ds_20260725_1001",
    "name": "Medium.csv",
    "upload_date": "2026-07-25 08:30:00",
    "status": "ready",
    "is_active": true,
    "rows": 500,
    "analysis_id": "ds_20260725_1001"
  }
]
```

---

#### `POST /datasets/upload`
Uploads a raw sales transaction CSV file.

**Request**: `multipart/form-data`
- `file`: CSV file attachment

**Response `200 OK`**:
```json
{
  "message": "Dataset uploaded successfully",
  "dataset": {
    "id": "ds_20260725_1002",
    "name": "Sales_Q3_2026.csv",
    "upload_date": "2026-07-25 08:35:12",
    "status": "pending",
    "is_active": false
  }
}
```

---

#### `POST /datasets/analyze`
Triggers full asynchronous execution of the machine learning pipeline on a target dataset.

**Request Body**:
```json
{
  "dataset_id": "ds_20260725_1002"
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Analysis executed successfully",
  "analysis_id": "ds_20260725_1002",
  "metrics": {
    "rows_processed": 500,
    "total_sales": 4859201.45,
    "total_profit": 1204910.12,
    "models_evaluated": ["forecasting", "churn", "recommendations"]
  }
}
```

---

#### `POST /datasets/set-active`
Sets the globally selected active dataset for dashboard visualization.

**Request Body**:
```json
{
  "dataset_id": "ds_20260725_1002"
}
```

**Response `200 OK`**:
```json
{
  "message": "Active dataset updated",
  "active_dataset_id": "ds_20260725_1002"
}
```

---

### 2. Executive BI Dashboard

#### `GET /dashboard/kpis`
Retrieves executive financial metrics calculated from active dataset.

**Query Parameters**:
- `dataset_id` (optional): Specific dataset ID (defaults to active dataset).

**Response `200 OK`**:
```json
{
  "total_revenue": 4859201.45,
  "net_profit": 1204910.12,
  "order_count": 500,
  "avg_order_value": 9718.40,
  "profit_margin": 24.79,
  "active_dataset": "Sales_Q3_2026.csv"
}
```

---

### 3. Sales Analytics

#### `GET /sales/overview`
Retrieves multidimensional sales breakdowns.

**Response `200 OK`**:
```json
{
  "by_channel": {
    "Retail": 1820400.12,
    "Online": 1948300.50,
    "Wholesale": 1090500.83
  },
  "by_category": {
    "Technology": 2100450.00,
    "Furniture": 1540200.30,
    "Office Supplies": 1218551.15
  },
  "top_sales_reps": [
    { "name": "Eve", "sales": 984500.00 },
    { "name": "David", "sales": 912000.00 }
  ]
}
```

---

### 4. Sales Forecasting

#### `GET /forecast`
Returns historical sales trajectory alongside future predicted data points with confidence bands.

**Response `200 OK`**:
```json
{
  "horizon_months": 6,
  "historical": [
    { "date": "2024-01-01", "sales": 340200.00 },
    { "date": "2024-02-01", "sales": 389100.00 }
  ],
  "forecast": [
    { "date": "2025-01-01", "predicted_sales": 412000.00, "lower_bound": 385000.00, "upper_bound": 439000.00 },
    { "date": "2025-02-01", "predicted_sales": 428500.00, "lower_bound": 398000.00, "upper_bound": 459000.00 }
  ],
  "accuracy_metrics": {
    "mae": 14230.12,
    "rmse": 18940.45,
    "mape": 4.12
  }
}
```

---

### 5. Product Recommendation Engine

#### `GET /recommendation`
Returns cross-selling recommendations derived from Market Basket Analysis.

**Response `200 OK`**:
```json
{
  "recommendations": [
    {
      "antecedent": "Phones Model 877",
      "consequent": "Wireless Charger Pad",
      "support": 0.15,
      "confidence": 0.78,
      "lift": 2.45
    }
  ]
}
```

---

### 6. Customer Churn Prediction

#### `GET /churn`
Retrieves customer risk classification metrics.

**Response `200 OK`**:
```json
{
  "high_risk_customers": 42,
  "medium_risk_customers": 118,
  "low_risk_customers": 340,
  "retention_rate": 87.2,
  "top_churn_factors": [
    "High discount sensitivity",
    "Decreased order frequency (>90 days)"
  ]
}
```
