# REST API Reference Documentation

The **Business Analytics Platform** provides a structured RESTful API. Every API response follows standard HTTP status code conventions and returns structured JSON responses.

---

## Standard JSON Error Response Format

All error responses (`4xx` and `5xx`) return the following structured JSON schema:

```json
{
  "success": false,
  "message": "Human readable error summary",
  "reason": "ExceptionClassName",
  "timestamp": "2026-07-25T08:35:19Z"
}
```

---

## API Endpoints Reference

### 1. Executive Dashboard
#### `GET /api/dashboard`
Returns complete executive metrics, KPIs, sales summaries, and model reports.

- **Parameters**:
  - `analysis_id` (Query string, optional): Target analysis ID (e.g. `ds_20260725_1001`). Defaults to active dataset.
- **Status Codes**:
  - `200 OK`: Data loaded successfully.
  - `404 Not Found`: Dataset or analysis run missing.
- **Example Response**:
```json
{
  "analysis": {
    "analysis_id": "ds_20260725_1001",
    "status": "Completed",
    "dataset_name": "Medium.csv",
    "model_version": "v1"
  },
  "kpis": {
    "total_sales": 4859201.45,
    "total_orders": 500,
    "avg_order_value": 9718.40,
    "total_profit": 1204910.12,
    "total_customers": 320,
    "churn_risk_count": 42
  }
}
```

---

### 2. Sales Analytics
#### `GET /api/sales`
Returns transaction aggregations grouped by channel, category, region, and sales rep.

- **Parameters**:
  - `analysis_id` (Query string, optional)
- **Status Codes**: `200 OK`, `404 Not Found`
- **Example Response**:
```json
[
  {
    "Order ID": "ORD-100001",
    "Sale_Date": "2024-10-16",
    "Sales_Amount": 5735.63,
    "Profit": 643.45,
    "Sales_Channel": "Retail",
    "Product_Category": "Office Supplies"
  }
]
```

---

### 3. Sales Forecasting
#### `GET /api/forecast`
Returns time-series historical data and machine learning predictions with confidence bounds.

- **Parameters**:
  - `analysis_id` (Query string, optional)
- **Status Codes**: `200 OK`, `404 Not Found`
- **Example Response**:
```json
[
  {
    "Date": "2025-01-01",
    "Actual_Sales": 410000.00,
    "Predicted_Sales": 412500.00,
    "Lower_Bound": 389000.00,
    "Upper_Bound": 436000.00
  }
]
```

---

### 4. Customer Segmentation & Churn
#### `GET /api/customers`
Returns customer RFM classifications, transaction counts, and churn risk scores.

- **Parameters**:
  - `analysis_id` (Query string, optional)
- **Status Codes**: `200 OK`, `404 Not Found`
- **Example Response**:
```json
[
  {
    "Customer ID": "CUST-9935",
    "Recency": 14,
    "Frequency": 8,
    "Monetary": 14200.50,
    "Cluster": "VIP",
    "Churn_Risk": "Low"
  }
]
```

---

### 5. Product Recommendations
#### `GET /api/recommendations`
Returns product association rules and cross-selling lift scores.

- **Parameters**:
  - `analysis_id` (Query string, optional)
- **Status Codes**: `200 OK`, `404 Not Found`
- **Example Response**:
```json
[
  {
    "antecedent": "Phones Model 877",
    "consequent": "Wireless Charger Pad",
    "support": 0.15,
    "confidence": 0.78,
    "lift": 2.45
  }
]
```

---

### 6. Reports & PDF Generation
#### `GET /api/reports`
Returns executive metrics and triggers PDF report download.

- **Parameters**:
  - `analysis_id` (Query string, optional)
- **Status Codes**: `200 OK`, `404 Not Found`

---

### 7. Dataset Management & Ingest
#### `POST /api/datasets/upload`
Uploads a new sales transaction CSV file.

- **Payload**: `multipart/form-data` with `file`
- **Status Codes**: `200 OK`, `400 Bad Request`

#### `POST /api/datasets/analyze`
Triggers full asynchronous execution of the machine learning pipeline.

- **Payload**: `{"dataset_id": "ds_20260725_1001"}`
- **Status Codes**: `200 OK`, `400 Bad Request`, `500 Server Error`

#### `POST /api/retrain` or `POST /datasets/<id>/retrain`
Triggers pipeline retraining and increments model version (`v1` → `v2`).

- **Status Codes**: `200 OK`, `500 Server Error`
