# Dataset Workflow & Data Lifecycle

This document describes the complete workflow of a dataset inside the **Business Analytics Platform**, tracking its ingestion, processing, persistence, and presentation.

---

## Data Flow Diagram

```
 ┌──────────────────────┐
 │ 1. CSV Upload        │ User uploads file via POST /api/datasets/upload
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 2. Ingest & Catalog  │ Store raw file in backend/data/uploads/<id>/
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 3. ML Pipeline       │ Subprocess runs ml/pipeline/run_pipeline.py
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 4. Artifact Storage  │ Write summary.json, forecast.json, churn.json, report.pdf
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 5. In-Memory Cache   │ backend/services/load_data.py populates LRU memory cache
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 6. UI Dashboard      │ React dashboard fetches data via GET /api/dashboard
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ 7. Retraining        │ User calls POST /api/retrain (Increments version v1 -> v2)
 └──────────────────────┘
```

---

## Multi-Dataset Isolation Guarantees

Every uploaded CSV receives a unique dataset ID (`analysis_id`). Analysis outputs are stored independently under `backend/data/analysis_runs/<analysis_id>/`.

This guarantees:
- No data contamination between multiple client uploads.
- Instant switching between active datasets via header drop-down.
- Complete audit trails of model versions (`v1`, `v2`, `v3`).
