# StackCheck Pro

An AI-powered developer environment health checker. Upload your dependency files and get a unified health report with CRITICAL / WARNING / INFO severity findings and exact fix commands — powered by Claude AI.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| AI | Anthropic Claude (`claude-3-5-sonnet-20241022`) |
| Scanner | Python 3 |

## Project Structure

```
StackCheck_Pro/
├── client/          # React + Vite frontend
├── server/          # Express API server
├── scanner/         # Python system scanner
├── .env.example     # Environment variable template
└── README.md
```

## Setup

### 1. Environment

```bash
cp .env.example .env
# Fill in ANTHROPIC_API_KEY and DATABASE_URL
```

### 2. Server

```bash
cd server
npm install
npm run dev
```

Starts on `http://localhost:5000`.

### 3. Client

```bash
cd client
npm install
npm run dev
```

Starts on `http://localhost:5173`.

### 4. System Scanner (optional)

```bash
cd scanner
python scan.py
```

Outputs `scanner/scan_output.json` — upload this file in the app for system-level analysis.

## API

### `POST /api/audit`

Accepts `multipart/form-data` with any combination of:

| Field | Type | Description |
|-------|------|-------------|
| `packageJson` | file | `package.json` from an npm project |
| `requirementsTxt` | file | `requirements.txt` from a Python project |
| `extensionsJson` | file | `.vscode/extensions.json` |
| `systemScan` | file | Output of `scanner/scan.py` |

Returns a health report JSON with findings sorted by severity.

### `GET /api/audit/:id`

Returns a previously stored audit report by UUID.

## Report Format

Each finding in the report has the shape:

```json
{
  "severity": "CRITICAL | WARNING | INFO",
  "category": "string",
  "title": "string",
  "description": "string",
  "fixCommand": "string | null"
}
```
