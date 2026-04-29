# Lux Money AI - Financial Behavior Prediction Project

Lux Money AI is a personal finance analytics dashboard built to analyze spending behavior, saving patterns, and predicted financial outcomes from structured transaction data. The project runs locally with Flask, SQLite, and a browser-based dashboard, with sample 12-month data for quick portfolio demonstration and support for real transactions through manual input or CSV import.

## Objectives

- Analyze personal spending behavior across income, expenses, categories, and monthly cash flow.
- Explore relationships between income share, expense categories, and saving rate.
- Compare predicted vs actual saving rate through dashboard metrics and AI-assisted insights.
- Apply predictive analytics techniques for financial behavior prediction and decision support.

## Tools Used

- Python
- Flask
- SQLite
- HTML/CSS/JavaScript
- Data visualization
- Predictive analytics techniques
- OpenAI API integration with local analytical fallback

## Dataset

The dataset contains structured financial behavior records including:

- expense category
- income share
- saving rate
- needs vs wants classification
- predicted saving rate
- transaction date, amount, type, note, and data source

The app includes a 12-month sample dataset for demo and analysis. Users can also add real financial records manually or import transaction files, while keeping sample, manual, and imported data separated by source.

## Key Insights

- Essential expenses dominate total spending behavior.
- Saving rate prediction aligns with observed financial patterns.
- Income share significantly influences saving capability.
- Monthly cash flow and category-level spending trends help identify budget pressure points.

## Core Features

- Monthly dashboard with income, expenses, net cash flow, saving rate, top category, and largest transaction.
- Transaction CRUD with filters for month, type, category, search term, source, and sorting.
- Data source filters for all data, sample data, real data, manual entries, and CSV imports.
- CSV/XLSX import wizard with preview, automatic header detection, dropdown column mapping, and duplicate protection.
- Budget management by month and category, with automatic spending progress from real transactions.
- Savings goals with progress tracking.
- 12-month analytics for cash flow, saving rate, daily spending heatmap, and top category trends.
- Recurring and subscription detection with confirm or ignore actions.
- AI assistant for monthly insights, transaction-based Q&A, and monthly or 12-month reports.
- Local analytical fallback when OpenAI is not configured.
- CSV transaction export and HTML finance report export.
- SQLite backup and restore.
- Lightweight local account system for user-linked data.
- CSRF protection for write requests and basic login rate limiting.
- PWA manifest and service worker so supported browsers can install the app.

## Installation

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a local environment file from the example:

```powershell
Copy-Item .env.example .env
```

To use the OpenAI integration, open `.env` and set:

```text
OPENAI_API_KEY=sk-your-key
SECRET_KEY=a-long-random-secret
```

The app still works without an API key. In that case, AI features use a local analytical fallback based on the available transaction data.

## Run Locally

```powershell
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

The default SQLite file is `finance.db` in the project root. When the app starts, it automatically migrates required schema columns such as `date`, `note`, and `source`.

## Sample Data

The dashboard includes an action to load 12 months of sample data. Sample records are marked with `source = sample`, so they can be filtered separately from manually entered or imported transactions.

Data sources:

- `sample`: demo data for portfolio presentation and testing.
- `manual`: transactions entered manually by the user.
- `import`: transactions imported from CSV/XLSX files.
- `real`: manual and imported transactions, excluding sample data.

## CSV / XLSX Import

In the Transactions tab:

1. Select a `.csv`, `.tsv`, or `.xlsx` file.
2. Preview the file.
3. Review the mapped date, amount, note, type, category, and date format columns.
4. Adjust the dropdown mapping if needed, for example selecting `MM/DD/YYYY` for US-style dates.
5. Import the file.

The app skips duplicate transactions using:

```text
date + amount + type + note
```

Common column names are detected automatically, including `date`, `date / time`, `amount`, `debit/credit`, `note`, `type`, `income/expense`, `category`, `debit`, `credit`, `description`, `transaction description`, and `memo`.

During preview and import, the app infers date ordering across the whole file to reduce ambiguous parsing issues such as reading `01/02/2018` incorrectly.

Imported data can be cleared separately by removing records with `source = import`, while sample and manual data remain available.

## AI

AI requests are handled through backend routes. API keys are never hardcoded in frontend code.

- Model: `gpt-4.1-mini`
- Environment variable: `OPENAI_API_KEY`
- If the API key is missing or OpenAI returns an error, the app uses a local fallback instead of crashing.
- To enable OpenAI responses, add `OPENAI_API_KEY` to `.env`, save the file, and restart `python app.py`.

Example questions:

- `Where did I spend the most this month?`
- `Compare this month to last month`
- `Am I over budget?`
- `Suggest a budget for next month`
- `How has my financial behavior changed over the last 12 months?`

## Export Reports

In the Transactions tab:

- CSV export downloads transactions based on the selected month and data source filters.
- HTML report export generates a finance report with summary metrics, insights, top categories, recurring items, and recent transactions.

The HTML report can be opened in a browser and printed or saved as PDF with `Ctrl+P`.

## Local Accounts

The Data tab includes a lightweight local account system:

- Without login, the app still works for local demo usage.
- After registration/login, new transactions, CSV imports, budgets, and goals are linked to `user_id`.
- Write requests use CSRF tokens, sessions use `HttpOnly/SameSite=Lax` cookies, and login has basic rate limiting.
- Database backup and restore are admin-only. Set `ADMIN_EMAILS=your-email@example.com`, register or log in with that email, then use the admin actions.
- For public deployment, set `ENABLE_DEMO_DATA=false` so unknown users cannot reload sample data.
- Keep `ENABLE_DB_RESTORE=false` on public deployments except when an admin intentionally needs to restore a trusted backup.
- This is a simple local auth layer for portfolio and demo use. For production, run behind HTTPS, set `SESSION_COOKIE_SECURE=true`, use a production database, and audit authorization carefully.

## Backup / Restore

In the Data tab:

- Database backup downloads the current `finance.db` file.
- Database restore uploads a trusted SQLite backup and replaces the current database.

Before restore, the app automatically creates a backup named:

```text
finance.db.before-restore-YYYYMMDD-HHMMSS.bak
```

Restore replaces the current data, so it should only be used with trusted backup files.

## PWA

The app includes `manifest.json`, `icon.svg`, and `sw.js`. Supported browsers can show an Install App option. The Flask server is still required for API routes; the service worker only caches the static app shell.

## Deploy to Render or Railway

The repo includes:

- `Procfile`
- `render.yaml`
- `gunicorn` in `requirements.txt`

Start command:

```text
gunicorn app:app
```

Recommended environment variables:

```text
SECRET_KEY=a-long-random-secret
OPENAI_API_KEY=sk-your-key
SESSION_COOKIE_SECURE=true
DB_PATH=/data/finance.db
ADMIN_EMAILS=admin@example.com
ENABLE_DEMO_DATA=false
ENABLE_DB_RESTORE=false
MAX_UPLOAD_MB=5
```

Important note: if deploying with SQLite, use persistent storage. The included `render.yaml` mounts a disk at `/data` and sets `DB_PATH=/data/finance.db`. On another platform, configure `DB_PATH` to point to a persistent directory.

## PostgreSQL / Production Database

The current app uses SQLite directly to keep local setup simple and demo-friendly. A real PostgreSQL migration would require:

- creating equivalent PostgreSQL schemas for `transactions`, `budgets`, `goals`, `users`, and `recurring_rules`;
- replacing `sqlite3` with a driver such as `psycopg`;
- changing SQL placeholders from `?` to `%s` or using a query builder/ORM;
- replacing SQLite file backup/restore with PostgreSQL dump/restore workflows.

A partial database migration is not recommended because it can easily break the current local SQLite workflow.

## Run Tests

```powershell
.\venv\Scripts\python.exe -m pytest -q
```

Tests use a temporary SQLite database and do not modify or delete the local `finance.db`.

## Smoke Check / Health Check

Health endpoint:

```text
GET /api/health
```

This endpoint checks SQLite connectivity, `PRAGMA integrity_check`, table record counts, OpenAI configuration status, PWA assets, session behavior, CSRF, and cookie settings.

Run the local smoke check without a browser:

```powershell
.\venv\Scripts\python.exe scripts\smoke_check.py
```

The script uses Flask's test client in-process. It only reads data and does not modify `finance.db`.

## Optional E2E Browser Test

The repo includes Playwright configuration in `package.json`, `playwright.config.js`, and `tests/e2e`.

Install Node.js first, then run:

```powershell
npm install
npx playwright install chromium
python app.py
```

In another terminal:

```powershell
npm run e2e
```

If `node` is not available in PATH, this step can be skipped. Pytest and the backend smoke check still work without Node.js.

## QA / Demo Checklist

Use this checklist before a demo or handoff:

- Run the app with `python app.py` and open `http://127.0.0.1:5000`.
- If the dashboard is empty, load the 12-month sample dataset.
- In Overview, switch months and verify summary cards, monthly chart, category chart, and heatmap.
- In Transactions, test filters for sample data, real data, manual entries, and imported data.
- Add a small transaction, edit it, then delete it.
- Import a small CSV file, preview it, verify column mapping, then import it.
- In Budgets, edit a budget and verify that progress updates from transactions in the same category.
- In Recurring, confirm one recurring item and ignore another to verify status behavior.
- In AI, ask: `Where did I spend the most this month?`
- Export CSV and HTML reports for the selected month.
- In Data, register a local account, log out, and log back in.
- Download a database backup.
- Test restore only with a trusted test backup file.
- Run `.\venv\Scripts\python.exe -m pytest -q` and confirm all tests pass.

## Troubleshooting

- If `node --check static/app.js` returns `node is not recognized`, Node.js is not installed or is not in PATH. The app still works because the frontend is plain browser JavaScript.
- If AI returns fallback responses, check that `.env` contains `OPENAI_API_KEY` and that the `openai` package is installed.
- If CSV date import fails, use `YYYY-MM-DD`, `DD/MM/YYYY`, or `DD-MM-YYYY`, or select the correct date column in preview.
- If the dashboard is empty, load sample data or import/add new transactions.
