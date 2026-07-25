# System Architecture

The **Business Analytics Platform** is an enterprise-grade web application and automated machine learning suite designed to transform raw transaction datasets into actionable business intelligence, predictive sales forecasts, customer churn insights, and cross-selling recommendations.

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|                             React Single Page App (SPA)                            |
|             (Dashboard, Datasets, Sales, Forecast, Customers, Reports)            |
+-----------------------------------------------------------------------------------+
                                         │
                                  HTTP / REST API
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                                  FLASK BACKEND                                    |
|   ┌───────────────────┬───────────────────┬───────────────────┬───────────────┐   |
|   │  Datasets Route   │   Sales Route     │  Forecast Route   │ Churn Route   │   |
|   └───────────────────┴───────────────────┴───────────────────┴───────────────┘   |
|   ┌───────────────────┬───────────────────┬───────────────────┬───────────────┐   |
|   │ Recommendations   │  Dashboard Route  │   Reports Route   │ Data Loader   │   |
|   └───────────────────┴───────────────────┴───────────────────┴───────────────┘   |
+-----------------------------------------------------------------------------------+
                                         │
                               Subprocess Execution / IPC
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                             MACHINE LEARNING ENGINE                               |
|   ┌───────────────────┬───────────────────┬───────────────────┬───────────────┐   |
|   │   Preprocessing   │Feature Engineering│  Model Trainers   │ Visualizers   │   |
|   └───────────────────┴───────────────────┴───────────────────┴───────────────┘   |
+-----------------------------------------------------------------------------------+
                                         │
                               Persistence & Caching
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                                PERSISTENCE LAYER                                  |
|   backend/data/datasets.json ─── Dataset Registry                                 |
|   backend/data/uploads/      ─── Raw Input CSV Storage                            |
|   backend/data/analysis_runs/─── Per-Dataset ML Artifacts & Precomputed Metrics    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Tree Structure

```
Business-Analytics/
├── backend/                  # Flask REST API server
│   ├── app.py                # Flask application entry point & CORS configuration
│   ├── data/                 # System persistence & dataset run artifacts
│   │   ├── analysis_runs/    # Isolated analysis outputs per dataset ID
│   │   ├── datasets.json     # Dataset registry catalog
│   │   └── uploads/          # Raw uploaded CSV storage
│   ├── routes/               # Modular Flask Blueprint routes
│   │   ├── churn.py          # Customer churn endpoint
│   │   ├── dashboard.py      # Executive BI KPI aggregations
│   │   ├── datasets.py       # Dataset upload, switching, analysis, retraining
│   │   ├── forecast.py       # Time-series sales forecast endpoint
│   │   ├── recommendation.py # Product cross-selling recommendations
│   │   ├── reports.py        # Executive PDF/CSV report generation
│   │   └── sales.py          # Sales trend aggregations
│   ├── scripts/              # System maintenance scripts
│   └── services/             # Data loader caching & dataset lifecycle handlers
│       ├── dataset_manager.py# Dataset catalog state & analysis directories
│       └── load_data.py      # Precomputed JSON reader with LRU caching
│
├── frontend/                 # React frontend application
│   ├── public/               # Static assets & HTML template
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Sidebar, Charts)
│   │   ├── pages/            # Page views (Dashboard, Sales, Forecast, Datasets)
│   │   ├── services/         # API integration services
│   │   └── styles/           # CSS design system & global styles
│   └── package.json          # Frontend dependencies & scripts
│
├── ml/                       # Machine Learning pipeline engine
│   ├── data/                 # Raw/processed intermediate ML data
│   ├── eda/                  # Exploratory Data Analysis scripts
│   ├── feature_engineering/  # Categorical encodings, date features, profit calculations
│   ├── models/               # ML model modules (forecasting, churn, recommendation, RFM)
│   ├── pipeline/             # Pipeline runner, logging, & configuration
│   ├── preprocessing/        # Data cleaning, type conversion, validation
│   ├── reports/              # Summary report generators
│   └── visualization/        # Static chart generation scripts
│
├── docs/                     # Comprehensive project documentation
├── sample_datasets/          # Test CSV datasets (Small, Medium, Large)
├── screenshots/              # UI screenshot placeholders & assets
├── tests/                    # End-to-end and workflow verification test suites
├── README.md                 # Primary open-source landing page
├── LICENSE                   # MIT License
├── CONTRIBUTING.md           # Contribution guidelines & workflow
├── CHANGELOG.md              # Semantic version history
├── CODE_OF_CONDUCT.md        # Contributor Covenant v2.1
├── .env.example              # Environment configuration template
├── .gitignore                # Source control exclusion rules
└── requirements.txt          # Pinned backend/ML Python dependencies
```

---

## 3. Component Responsibilities

### Frontend Layer (`frontend/`)
- Built with **React 19**, **React Router v7**, and **Recharts / Chart.js**.
- Provides a responsive dashboard for executive decision-makers.
- Manages global active dataset state via dataset switching components.
- Handles file uploads via custom drop-zones and progress state indicators.

### Backend REST API Layer (`backend/`)
- Built with **Flask**, **flask-cors**, and **Pandas**.
- Exposes modular REST endpoints grouped into Flask Blueprints.
- Manages dataset metadata registry (`datasets.json`).
- Orchestrates asynchronous ML pipeline execution via Python subprocess invocations.
- Implements an LRU memory cache (`load_data.py`) for serving precomputed analysis results to UI components in sub-millisecond speeds.

### Machine Learning Engine (`ml/`)
- Modular Python architecture for tabular data preprocessing, feature engineering, model training, and analytical report generation.
- Uses **scikit-learn**, **XGBoost**, **joblib**, **numpy**, and **pandas**.
- Executes as a deterministic pipeline (`python ml/pipeline/run_pipeline.py --analysis-id <ID> --data <PATH>`).
- Saves calculated analytical artifacts, metrics, and trained model objects into `backend/data/analysis_runs/<analysis_id>/`.

---

## 4. Multi-Dataset Isolation Architecture

The system supports running independent analyses on distinct uploaded CSV files. Each dataset upload triggers the following storage layout:

```
backend/data/analysis_runs/
└── <dataset_id>/
    ├── summary.json          # Precomputed KPIs, sales metrics, and distributions
    ├── forecast.json         # Time-series historical & predicted sales points
    ├── recommendation.json   # Product association rules & cross-selling recommendations
    ├── churn.json            # Customer risk scoring & churn classification metrics
    └── report.pdf            # Compiled executive PDF report artifact
```

This guarantees complete isolation between client uploads and enables real-time switching without data contamination.
