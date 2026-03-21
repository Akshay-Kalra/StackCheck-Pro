# ⚡ StackCheck Pro

**AI-powered developer environment health checker — audit your npm, Python, VS Code, and system dependencies in one unified report.**

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Claude](https://img.shields.io/badge/Anthropic_Claude-3.5_Sonnet-D4B483?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

---

## 🤔 What is StackCheck Pro?

Modern development environments are a tangle of package managers, runtimes, and extensions — each with their own versioning and security lifecycles. A single outdated dependency or an end-of-life runtime can introduce silent vulnerabilities, subtle breakage, or hours of debugging.

**StackCheck Pro solves this** by giving developers a single command to upload their dependency files and get back a structured, severity-sorted health report — powered by Anthropic's Claude AI. Instead of manually checking dozens of registries and changelogs, you get **CRITICAL / WARNING / INFO** findings with exact shell commands to fix each issue, all in under 30 seconds.

---

## ✨ Features

### 📦 npm Audit Module
Upload your `package.json` and StackCheck Pro cross-references every dependency against the npm registry. It detects outdated packages, flags major version gaps (3+ versions behind) as **CRITICAL**, and provides exact `npm install` upgrade commands for every finding.

### 🐍 PyPI Audit Module
Upload your `requirements.txt` to check all Python dependencies against PyPI. Outdated packages, deprecated libraries, and missing security patches are surfaced with matching `pip install --upgrade` fix commands.

### 🧩 VS Code Extensions Module
Upload your `.vscode/extensions.json` (or the extensions list from the system scanner) to audit your editor setup. StackCheck Pro fetches extension metadata and flags stale or unmaintained extensions before they break your workflow.

### 🖥️ System Scan Module
Run the bundled Python scanner to snapshot your entire local environment — OS, Node.js, Python, Git, Docker, Go, Java, Rust runtimes, npm global packages, pip packages, and VS Code extensions. Upload the resulting JSON for a full-system health report with AI-generated remediation advice.

---

## 📸 Screenshots

<!-- Add screenshot here -->

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS v3 | Responsive SPA with file upload & report UI |
| **Backend** | Node.js + Express | REST API, file parsing, audit orchestration |
| **Database** | PostgreSQL | Persistent audit report storage |
| **AI Engine** | Anthropic Claude 3.5 Sonnet | Structured findings generation |
| **Scanner** | Python 3 | Local environment snapshot collection |
| **Registry APIs** | npm, PyPI, Open VSX | Live version & metadata lookups |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ and **npm** v10+
- **Python** 3.7+ (for the system scanner)
- **PostgreSQL** 14+ running locally or via a connection string
- An **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/vsgautam22/StackCheck-Pro.git
cd StackCheck-Pro
```

---

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
ANTHROPIC_API_KEY=sk-ant-...          # Your Anthropic API key
DATABASE_URL=postgresql://user:password@localhost:5432/stackcheck_pro
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

### 3. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE stackcheck_pro;"
```

> The server will auto-run migrations on startup — no manual schema setup required.

---

### 4. Install server dependencies & start the API

```bash
cd server
npm install
npm run dev
```

The Express API starts at **http://localhost:5000**.

---

### 5. Install client dependencies & start the frontend

```bash
cd client
npm install
npm run dev
```

The React app starts at **http://localhost:5173**. Open it in your browser.

---

### 6. (Optional) Run the system scanner

```bash
cd scanner
python scan.py
```

This produces `scanner/scan_output.json`. Upload this file in the **System Scan** tab of the app for a full local environment audit.

---

## ⚙️ How It Works

```
User uploads file(s)
       │
       ▼
  Express API receives multipart upload
       │
       ├─► npm module   → fetches each package from registry.npmjs.org
       ├─► PyPI module  → fetches each package from pypi.org/pypi
       ├─► VS Code mod  → fetches extension metadata from Open VSX
       └─► System mod   → parses scan_output.json directly
       │
       ▼
  Audit context is merged into a structured prompt
       │
       ▼
  Claude 3.5 Sonnet analyses the context
  and returns a validated JSON findings array
       │
       ▼
  Report is stored in PostgreSQL with a UUID
       │
       ▼
  Client renders findings sorted by severity
  (CRITICAL → WARNING → INFO)
  Each finding includes: title, description, category, fix command
```

The AI prompt is carefully engineered to enforce the exact JSON schema — no markdown fences, no prose — so the response can be parsed deterministically and stored as structured data.

---

## 📁 Project Structure

```
StackCheck-Pro/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   └── main.jsx
│   └── index.html
├── server/              # Express API server
│   ├── config/          # Environment & DB config
│   ├── routes/          # API route handlers
│   ├── services/        # Claude AI & registry services
│   └── index.js
├── scanner/             # Python system scanner
│   ├── scan.py
│   └── README.md
├── .env.example         # Environment variable template
└── README.md
```

---

## 🏗️ Built by

**Gautam Suresh** — [@vsgautam22](https://github.com/vsgautam22)

> If you found this useful, consider leaving a ⭐ on [GitHub](https://github.com/vsgautam22/StackCheck-Pro)!
