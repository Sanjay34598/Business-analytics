# Dataset Lifecycle & Data Flow

This document details the step-by-step end-to-end lifecycle of a dataset within the **Business Analytics Platform**, tracking its progression from raw CSV upload to interactive UI dashboard rendering and executive report generation.

---

## Complete Lifecycle Diagram

```
┌─────────────────────────┐
│     1. CSV Upload       │  User uploads CSV via /datasets/upload
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     2. Validation       │  Verify headers, date formats, non-empty rows
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    3. Preprocessing     │  Sanitize data types, calculate costs & profits
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   4. Pipeline Training  │  Subprocess runs ml/pipeline/run_pipeline.py
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 5. Artifact Generation │  Write summary.json, forecast.json, churn.json, report.pdf
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   6. Cache Ingestion    │  backend/services/load_data.py loads into LRU memory
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   7. Dashboard Views    │  React frontend renders interactive KPIs & Recharts
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   8. Reports & Exports  │  Download PDF executive summary or CSV metrics
└─────────────────────────┘
```

---

## Lifecycle Stages Breakdown

### Stage 1: Upload
- User selects a CSV file from the UI or posts via `POST /datasets/upload`.
- The backend checks for valid file extension (`.csv`), generates a unique `dataset_id` (e.g. `ds_20260725_1001`), saves the raw file to `backend/data/uploads/<filename>`, and registers an entry in `backend/data/datasets.json`.

### Stage 2: Schema Validation
- The dataset checker (`ml/preprocessing/check_dataset.py`) verifies critical fields:
  - `Order ID`
  - `Sale_Date`
  - `Sales_Amount`
  - `Quantity_Sold`
  - `Customer ID`
- If validation fails, an error response (`400 Bad Request`) is returned to the user with specific missing column names.

### Stage 3: Preprocessing & Feature Extraction
- Raw strings are cast to typed columns: `Sale_Date` → `datetime64[ns]`, `Sales_Amount` → `float64`.
- Derived features are generated: `Profit = Sales_Amount - (Unit_Cost * Quantity_Sold)`, `Profit_Margin = Profit / Sales_Amount`.
- Temporal dimensions are appended (`Year`, `Month`, `Quarter`, `DayOfWeek`).

### Stage 4: Asynchronous Training & Execution
- The Flask backend spawns an isolated subprocess running `ml/pipeline/run_pipeline.py`.
- Models execute:
  1. Sales forecasting time-series model.
  2. RFM customer segmentation and K-Means clustering.
  3. Customer churn probability scoring.
  4. Product basket cross-selling association rule mining.

### Stage 5: Artifact Persistence
- Pipeline outputs are stored under `backend/data/analysis_runs/<dataset_id>/`:
  - `summary.json`
  - `forecast.json`
  - `recommendation.json`
  - `churn.json`
  - `report.pdf`

### Stage 6: In-Memory Caching & Dataset Switching
- When a dataset is set as active (`POST /datasets/set-active`), `backend/services/load_data.py` populates an LRU memory cache.
- Switching between datasets invalidates prior cache keys and loads the newly selected dataset's artifacts instantly.

### Stage 7: Interactive Dashboard Visualization
- React frontend components fetch pre-processed JSON data endpoints (`/dashboard/kpis`, `/sales/overview`, `/forecast`, `/churn`, `/recommendation`).
- Charts update dynamically without page reloads.

### Stage 8: Retraining & Version Management
- Users can trigger `POST /datasets/<dataset_id>/retrain` to re-run the pipeline with updated data parameters.
- Model versions automatically increment (`v1` → `v2` → `v3`), maintaining a historical audit trail.
