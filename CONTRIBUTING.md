# Contributing to Business Analytics Platform

Thank you for your interest in contributing to the **Business Analytics Platform**! We welcome contributions from developers, data scientists, and UI/UX designers to help make this enterprise business intelligence platform even better.

---

## Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand our standards for community interaction.

---

## How Can I Contribute?

### Reporting Bugs
If you find a bug or unexpected behavior:
1. Search existing [GitHub Issues](../../issues) to see if it has already been reported.
2. If not, open a new issue with a clear title, reproduction steps, expected vs. actual behavior, and environment details (Python version, Node.js version, OS).

### Feature Requests
We welcome ideas for enhancements! Submit an issue detailing:
- The problem or use case.
- The proposed solution or feature.
- Any alternative solutions considered.

---

## Development Workflow

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/Business-analytics.git
cd Business-analytics
```

### 2. Branch Naming Conventions
Use descriptive prefixes for your branch names:
- `feature/` for new features (e.g., `feature/streaming-datasets`)
- `fix/` for bug fixes (e.g., `fix/forecast-date-parsing`)
- `docs/` for documentation updates (e.g., `docs/api-examples`)
- `refactor/` for code refactoring (e.g., `refactor/ml-preprocessing`)
- `test/` for adding or updating unit/integration tests

Example:
```bash
git checkout -b feature/churn-model-xgboost
```

### 3. Environment Setup

#### Backend Setup
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### 4. Running the Application Locally
- **Backend Server**: `python backend/app.py` (Runs on `http://127.0.0.1:5000`)
- **Frontend App**: `npm start` inside `frontend/` (Runs on `http://localhost:3000` or `http://localhost:3001`)

---

## Commit Message Guidelines

We enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification:

Format: `<type>(<scope>): <short summary>`

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi-colons, no code logic change
- `refactor`: Refactoring production code
- `perf`: Performance improvement
- `test`: Adding missing tests or refactoring existing tests
- `chore`: Updating build tasks, package managers, configuration

Examples:
```bash
git commit -m "feat(ml): add XGBoost ensemble model for churn prediction"
git commit -m "fix(backend): correct dataset active state cache invalidation"
git commit -m "docs(api): update OpenAPI specs for /datasets/upload endpoint"
```

---

## Code Style & Guidelines

### Python (Backend & ML)
- Follow **PEP 8** standards.
- Include explicit type hints where beneficial.
- Preserve clean logging and exception handling. Do not suppress exceptions silently.
- Keep ML scripts modular (`preprocessing/`, `feature_engineering/`, `models/`, `pipeline/`).

### JavaScript / React (Frontend)
- Use functional components with React Hooks.
- Follow modern ES6+ JavaScript standard syntax.
- Style UI components cleanly using CSS module/standard CSS variables.
- Ensure all interactive elements have unique `id` and accessible `aria-` tags.

---

## Testing & Verification

Before submitting a Pull Request, verify that all automated tests pass:

```bash
# Run backend & ML workflow verification tests
python tests/test_workflow_verification.py
python tests/test_e2e_verification.py

# Verify frontend production build
cd frontend
npm run build
```

---

## Submitting a Pull Request (PR)

1. Ensure your branch is up-to-date with `main`.
2. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request on GitHub.
4. Fill out the PR template providing:
   - Clear description of the changes.
   - Associated issue numbers (e.g., `Fixes #42`).
   - Summary of verification tests conducted.
5. Wait for review and address any review feedback promptly.
