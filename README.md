# Business Analytics Platform

### Enterprise Machine Learning & Business Intelligence Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-blue.svg)](requirements.txt)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](frontend/package.json)
[![Flask 3.0](https://img.shields.io/badge/Flask-3.0-000000.svg)](backend/app.py)
[![Code Style: PEP8](https://img.shields.io/badge/code%20style-pep8-green.svg)](CONTRIBUTING.md)

An end-to-end enterprise web application combining interactive business intelligence dashboards, real-time dataset management, and an automated machine learning pipeline for sales forecasting, RFM customer segmentation, predictive churn scoring, and product cross-selling recommendation engines.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [Dashboard](#1-dashboard)
  - [Dataset Management](#2-dataset-management)
  - [Machine Learning](#3-machine-learning)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Dataset Lifecycle](#dataset-lifecycle)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Documentation Suite](#documentation-suite)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Project Overview

### Purpose
The **Business Analytics Platform** bridges the gap between raw transactional data and strategic decision-making. It enables business leaders, financial analysts, and sales operations managers to upload sales transaction data, run sophisticated ML analytical pipelines, and visualize actionable intelligence through intuitive interactive dashboards.

### Business Problem Solved
Traditional business intelligence tools often require complex ETL pipelines, specialized data science skills, or static manual spreadsheet updates. This platform automates data validation, feature engineering, predictive forecasting, churn risk identification, and executive report compilation into a single, unified self-service web application.

### Key Capabilities
- **Automated End-to-End ML Pipeline**: Cleans raw transaction logs, extracts temporal & margin features, trains models, and generates analytical artifacts in one click.
- **Isolated Multi-Dataset Ingestion**: Upload, switch, and compare multiple transaction datasets independently without server restart.
- **Predictive Sales & Churn Analytics**: Forecast future sales revenues with confidence bounds and identify high-risk churn customers.
- **Market Basket Recommendation Engine**: Uncover cross-selling opportunities using product association rules.
- **Automated Report Generation**: Generate single-click PDF executive summaries and CSV exports.

---

## Features

### 1. Dashboard
- **Executive KPIs**: Real-time cards for Gross Revenue, Net Profit, Order Volume, Average Order Value (AOV), and Profit Margin %.
- **Sales Analytics**: Multi-dimensional trend analysis by channel (Retail, Online, Wholesale), category, state/region, and sales representative.
- **Forecast Visualization**: Interactive time-series charts displaying historical sales alongside ML predictions with upper/lower confidence bounds.
- **Customer Segmentation**: RFM (Recency, Frequency, Monetary) matrix and K-Means customer cluster visualizations.
- **Recommendations**: Top product pairing suggestions derived from basket co-occurrence.
- **Reports**: Auto-compiled executive summaries with single-click PDF export.

### 2. Dataset Management
- **Upload CSV**: Drag-and-drop CSV uploader with client and server schema validation.
- **Dataset History**: Complete catalog of uploaded datasets, processing statuses, row counts, and timestamps.
- **Multiple Datasets**: Support for storing and switching between multiple dataset runs.
- **Dataset Switching**: Global real-time active dataset switching via header drop-down.
- **Independent Analysis**: Per-dataset storage isolation ensuring data integrity across runs.
- **Retraining**: Trigger on-demand pipeline execution with automated model version incrementing (`v1` → `v2`).

### 3. Machine Learning
- **Data Preprocessing**: Type inference, currency sanitization, missing value imputation, and header verification.
- **Forecasting**: Time-series lag feature extraction and regression modeling with 95% confidence intervals.
- **Churn Prediction**: Transaction recency analysis, order frequency tracking, and customer churn probability scoring.
- **Recommendation Engine**: Association rule mining computing Support, Confidence, and Lift.
- **Model Versioning**: Automated model version auditing and metadata tracking.
- **Performance Metrics**: Evaluation via MAE, RMSE, MAPE, and Silhouette Scores.

---

## Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend** | React 19 | Component-driven Single Page Application (SPA) |
| **Routing** | React Router v7 | Dynamic client-side application routing |
| **Data Viz** | Recharts & Chart.js | Interactive charts, timelines, and distribution plots |
| **Styling** | Vanilla CSS | Custom design system with modern tokens, dark theme & glassmorphism |
| **Backend** | Flask 3.0 | Lightweight, modular RESTful API web framework |
| **Data Processing**| Pandas & NumPy | High-performance tabular data manipulation |
| **Machine Learning**| Scikit-learn & XGBoost | Feature engineering, clustering, regression & classification |
| **Persistence** | Joblib | Model serialization and pipeline artifact caching |
| **Utilities** | PapaParse | Client-side CSV parsing |
| **Utilities** | OpenPyXL | Excel spreadsheet parsing and data manipulation |
| **Utilities** | ReportLab | Programmatic PDF report document generation |

---

## Architecture

```
Business-Analytics/
├── backend/                  # Flask REST API server & services
│   ├── app.py                # Flask entry point & CORS configuration
│   ├── data/                 # System persistence & dataset analysis runs
│   ├── routes/               # REST API Blueprint endpoints
│   ├── scripts/              # Project maintenance utilities
│   └── services/             # In-memory LRU loader & catalog manager
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI widgets & navigation
│   │   ├── pages/            # View pages (Dashboard, Sales, Forecast, Datasets)
│   │   └── services/         # API HTTP communication layer
│   └── package.json          # Frontend dependencies & scripts
├── ml/                       # Machine Learning pipeline engine
│   ├── feature_engineering/  # Feature transformers & encodings
│   ├── models/               # Forecasting, Churn, Segmentation & Recommendations
│   ├── pipeline/             # Pipeline runner & config handlers
│   └── preprocessing/        # Data validation & sanitization
├── docs/                     # Full technical documentation suite
├── sample_datasets/          # Standardized test CSV datasets (Small, Medium, Large)
├── screenshots/              # UI screenshot assets & guidelines
├── tests/                    # End-to-end verification test scripts
├── README.md                 # Project landing page
├── LICENSE                   # MIT License
├── CONTRIBUTING.md           # Contribution guidelines
├── CHANGELOG.md              # Semantic release notes
├── CODE_OF_CONDUCT.md        # Contributor Covenant Code of Conduct
├── .env.example              # Environment variables template
├── .gitignore                # Source control exclusion rules
└── requirements.txt          # Pinned backend/ML Python dependencies
```

For complete architectural details, see [docs/Architecture.md](file:///docs/Architecture.md).

---

## Dataset Lifecycle

```
 ┌──────────────────────┐
 │ 1. Dataset Upload    │ User uploads CSV via frontend or REST API
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 2. Schema Validation │ Verify columns (Order ID, Sale_Date, Amount, Profit)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 3. Preprocessing     │ Parse dates, clean numbers, derive profit margins
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 4. Pipeline Training │ Train time-series forecast, RFM K-Means, Churn risk
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 5. Prediction Output │ Write summary.json, forecast.json, churn.json, report.pdf
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 6. UI Dashboard      │ React components consume REST endpoints via LRU cache
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 7. Reports Export    │ Export PDF executive summary or download raw metrics
 └──────────────────────┘
```

For detailed data flow stage descriptions, see [docs/Dataset-Lifecycle.md](file:///docs/Dataset-Lifecycle.md).

---

## API Documentation

### Key Endpoints Overview

#### 1. Retrieve Uploaded Datasets
- **Endpoint**: `GET /datasets`
- **Response `200 OK`**:
```json
[
  {
    "id": "ds_20260725_1001",
    "name": "Medium.csv",
    "upload_date": "2026-07-25 08:30:00",
    "status": "ready",
    "is_active": true,
    "rows": 500
  }
]
```

#### 2. Execute Dataset Analysis
- **Endpoint**: `POST /datasets/analyze`
- **Request Payload**:
```json
{
  "dataset_id": "ds_20260725_1001"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Analysis executed successfully",
  "analysis_id": "ds_20260725_1001"
}
```

#### 3. Fetch Executive Dashboard KPIs
- **Endpoint**: `GET /dashboard/kpis`
- **Response `200 OK`**:
```json
{
  "total_revenue": 4859201.45,
  "net_profit": 1204910.12,
  "order_count": 500,
  "avg_order_value": 9718.40,
  "profit_margin": 24.79
}
```

#### 4. Fetch Sales Forecast
- **Endpoint**: `GET /forecast`
- **Response `200 OK`**:
```json
{
  "horizon_months": 6,
  "forecast": [
    { "date": "2025-01-01", "predicted_sales": 412000.00, "lower_bound": 385000.00, "upper_bound": 439000.00 }
  ]
}
```

For full endpoint specifications, payload schemas, and response examples, see [docs/API.md](file:///docs/API.md).

---

## Installation

### Prerequisites
- **Python**: `3.10+`
- **Node.js**: `18+` and `npm`

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/Business-analytics.git
cd Business-analytics
```

### Step 2: Set Up Backend Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows:
venv\Scripts\activate
# Activate on Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
```

### Step 3: Set Up Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 4: Run the Application
1. **Launch Flask Backend** (Terminal 1):
   ```bash
   python backend/app.py
   ```
   *Backend starts at `http://127.0.0.1:5000`*

2. **Launch React Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```
   *Frontend opens automatically at `http://localhost:3000`*

---

## Screenshots

> *Note: Below are placeholders for visual assets. See [screenshots/README.md](file:///screenshots/README.md) for capturing guidelines.*

### Executive BI Dashboard
![Dashboard Overview](screenshots/dashboard_overview.png)
*Real-time executive KPIs, gross revenue trends, and regional performance.*

### Dataset Management & Switching
![Dataset Management](screenshots/dataset_management.png)
*Upload new CSVs, manage active datasets, and trigger automated pipeline runs.*

### Predictive Sales Forecasting
![Forecast Analytics](screenshots/forecast_analytics.png)
*Time-series machine learning forecast with lower and upper confidence intervals.*

### Executive Reports & Export
![Reports Generator](screenshots/reports_analytics.png)
*Single-click executive PDF report generation and metric breakdown.*

### Settings & System Config
![Settings Overview](screenshots/settings_overview.png)
*Application configuration, model defaults, and active environment status.*

---

## Future Improvements

- [ ] **Authentication & Security**: JWT-based user login and token security.
- [ ] **Cloud Deployment**: One-click AWS / GCP deployment scripts and Terraform templates.
- [ ] **Dockerization**: Containerized `docker-compose.yml` for instant zero-dependency deployment.
- [ ] **Real-Time Streaming Analytics**: Integration with Apache Kafka / WebSockets for live transaction processing.
- [ ] **Role-Based Access Control (RBAC)**: Fine-grained permissions for Analysts, Managers, and Admins.
- [ ] **Automated Retraining Schedules**: Scheduled cron-based model retraining on incoming streaming datasets.
- [ ] **Model Drift Monitoring**: Integrated performance tracking and drift detection alerts.

---

## Documentation Suite

Explore our comprehensive technical guides inside the `docs/` folder:

- [Architecture Guide](file:///docs/Architecture.md) — System design, components, and persistence layer.
- [REST API Reference](file:///docs/API.md) — Detailed endpoint documentation and example JSON responses.
- [Machine Learning Pipeline](file:///docs/ML-Pipeline.md) — Preprocessing algorithms, feature engineering, and model training.
- [Dataset Lifecycle](file:///docs/Dataset-Lifecycle.md) — End-to-end data flow from CSV ingest to dashboard rendering.
- [Deployment Guide](file:///docs/Deployment.md) — Setup instructions for development, WSGI, and Nginx hosting.
- [Troubleshooting & FAQs](file:///docs/Troubleshooting.md) — Common error resolution and diagnostic steps.

---

## Contributing

We welcome community contributions! Please read our [CONTRIBUTING.md](file:///CONTRIBUTING.md) for details on our branch naming conventions, commit message standards, and pull request workflows. All community members are expected to follow our [CODE_OF_CONDUCT.md](file:///CODE_OF_CONDUCT.md).

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](file:///LICENSE) file for details.

---

## Author

**Enterprise Machine Learning & Business Analytics Team**  
*Built for portfolio, enterprise BI, and high-performance ML showcases.*
