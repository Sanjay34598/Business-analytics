# System Architecture Documentation

The **Business Analytics Platform** is structured as an enterprise-grade microservice architecture combining a React Single Page Application (SPA), a Flask REST API backend, and an isolated Python Machine Learning engine.

---

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                FRONTEND INTERFACE                                 |
|                               React 19 SPA (Vite/CRA)                             |
|          (Executive Dashboard, Datasets, Forecasts, Churn, Reports)               |
+-----------------------------------------------------------------------------------+
                                         │
                                   HTTP / REST API
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                                FLASK REST BACKEND                                 |
|   ┌───────────────────┬───────────────────┬───────────────────┬───────────────┐   |
|   │   Datasets API    │    Sales API      │   Forecast API    │   Churn API   │   |
|   └───────────────────┴───────────────────┴───────────────────┴───────────────┘   |
|   ┌───────────────────┬───────────────────┬───────────────────┬───────────────┐   |
|   │Recommendations API│   Dashboard API   │   Reports API     │ Logging Handler│   |
|   └───────────────────┴───────────────────┴───────────────────┴───────────────┘   |
+-----------------------------------------------------------------------------------+
                                         │
                             Isolated Subprocess Runner
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                             MACHINE LEARNING ENGINE                               |
|   ┌───────────────────┬───────────────────┬───────────────────┬───────────────┐   |
|   │   Preprocessing   │Feature Engineering│ Time-Series Model │ RFM Clustering│   |
|   └───────────────────┴───────────────────┴───────────────────┴───────────────┘   |
+-----------------------------------------------------------------------------------+
                                         │
                              Per-Dataset Isolation
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                                PERSISTENCE LAYER                                  |
|   backend/data/datasets.json ─── Dataset Catalog                                  |
|   backend/data/uploads/      ─── Raw Input CSV Storage                            |
|   backend/data/analysis_runs/─── Per-Dataset Analysis Artifacts & Precomputed Cache|
+-----------------------------------------------------------------------------------+
```

---

## 2. Component Design Principles

### Frontend Application
- Built with React functional components and hooks (`useCallback`, `useMemo`, `useState`).
- Uses custom Context API (`DatasetContext`) to sync active dataset state globally.
- Implements chart components powered by Recharts and Chart.js.

### Backend API & Services
- Modular Flask Blueprints (`backend/routes/`).
- Centralized in-memory LRU cache (`backend/services/load_data.py`) serving precomputed analytical outputs.
- Subprocess isolation runner triggering `ml/pipeline/run_pipeline.py`.
- Formatted file & console logging (`logs/app.log`).

### Machine Learning Engine
- Tabular data sanitization and feature extraction (`ml/preprocessing/`, `ml/feature_engineering/`).
- Modular statistical and machine learning models (`ml/models/`).
- Deterministic artifact creation per analysis ID.
