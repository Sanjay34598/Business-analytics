# Changelog

All notable changes to the **Business Analytics Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] - 2026-07-25

### Initial Enterprise Release

#### Features & Dashboard
- **Executive BI Dashboard**: Interactive KPIs for Gross Revenue, Net Profit, Order Volume, Average Order Value, and Profit Margin.
- **Sales Analytics**: Deep-dive channel breakdown (Retail, Online, Wholesale), regional performance analysis, top-performing sales reps, and payment mode distributions.
- **Forecast Engine**: Interactive time-series sales forecasting using statistical & Machine Learning models with visual confidence bounds and horizon selection.
- **Customer Segmentation & Churn**: Customer segmentation visualization and predictive customer churn analysis based on historical transactional behavior.
- **Automated Recommendation Engine**: Cross-selling and product recommendation engine leveraging association rule mining and purchase frequency patterns.
- **Executive Reports Generator**: Single-click PDF and CSV executive report generation with auto-compiled business metrics and charts.

#### Dataset Management System
- **Dynamic Dataset Upload**: CSV file upload, schema validation, and immediate ingest.
- **Isolated Analysis Executions**: Multi-dataset architecture supporting independent analysis runs stored per dataset ID in `backend/data/analysis_runs/`.
- **Dataset Switching**: Real-time dataset switching via header UI without server restart.
- **Model Versioning & Retraining**: Trigger model retraining per dataset with incremented model versions (`v1`, `v2`, etc.).

#### Backend & ML Pipeline
- **Flask RESTful API**: Structured Blueprint routes (`/datasets`, `/sales`, `/forecast`, `/recommendation`, `/reports`, `/churn`, `/dashboard`).
- **Modular Pipeline Execution**: Automated ML pipeline workflow (`preprocessing` → `feature_engineering` → `models` → `reports`).
- **Caching Layer**: Pre-computed analysis cache invalidation on dataset deletion and retraining.

#### Documentation & Repository Architecture
- Complete open-source documentation suite in `docs/` (`Architecture.md`, `API.md`, `ML-Pipeline.md`, `Dataset-Lifecycle.md`, `Deployment.md`, `Troubleshooting.md`).
- Standardized sample datasets (`Small.csv`, `Medium.csv`, `Large.csv`).
- Comprehensive root project metadata (`README.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `.env.example`).
