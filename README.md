# KSP AI Investigation Copilot

**Karnataka State Police Datathon Challenge 1 — Hackathon Submission**

A production-grade digital forensics and AI investigation assistant console designed for the Karnataka State Police. Officers can manage FIR case files, ingest and track forensic evidence assets with immutable chain-of-custody logs, run AI-powered OCR and entity extraction pipelines, visualize entity relationship graphs, compile chronological investigation timelines, and generate structured case reports — all from a single, bilingual (English / Kannada) interface.

---

## Features

| Feature | Description |
|---|---|
| **Officer Authentication** | Secure KGID login with Zoho Catalyst SDK integration and mock development fallback. |
| **Case Workspace** | Create, update, and archive FIR case files. Includes victim/suspect records, investigation notes journal, and immutable activity logs. |
| **Evidence Vault** | Ingest forensic assets (documents, digital media, devices, physical items). Tracks immutable chain-of-custody handovers with timestamps. |
| **AI Intelligence Engine** | Provider-agnostic OCR text extraction and named entity recognition (persons, phones, vehicles, dates, addresses). Officers can accept or reject AI suggestions with full audit trails. |
| **Knowledge Graph** | Interactive SVG relationship graph mapping entity connections across evidence and persons. Supports drag, zoom, and pan. |
| **Investigation Timeline** | Merged chronological view of case events, evidence handovers, note entries, and AI review decisions. |
| **Reports Console** | Structured investigation report templates with JSON export and browser print functionality. Officer briefing summaries included. |
| **Bilingual UI** | Full English and ಕನ್ನಡ (Kannada) localization with runtime language toggle. |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Static Export)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (custom design tokens)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Zoho Catalyst Client Hosting

---

## Local Development Setup

### 1. Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the provided template and populate your Catalyst credentials:
```bash
cp .env.template .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_CATALYST_PROJECT_ID="your-catalyst-project-id"
NEXT_PUBLIC_CATALYST_CLIENT_ID="your-catalyst-client-id"
NEXT_PUBLIC_CATALYST_AUTH_DOMAIN="your-auth-domain"
```

> **Note:** If these values are left empty or set to `mock_project_id`, the application automatically falls back to local mock authentication mode. Default test credentials are `KGID: 123456 / Password: password`.

### 4. Start the Development Server
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000).

---

## Production Build

To generate an optimized static bundle for Zoho Catalyst Client Hosting:
```bash
npm run build
```

The compiled static assets will be written to the `out/` directory.

---

## Deployment to Zoho Catalyst

Refer to the detailed deployment playbook at [`knowledge-base/DEPLOYMENT.md`](knowledge-base/DEPLOYMENT.md) for the complete step-by-step Catalyst CLI deployment process.

**Quick Summary:**
```bash
# 1. Login to Catalyst CLI
catalyst login

# 2. Select the target project
catalyst use

# 3. Deploy the static bundle
catalyst deploy
```

---

## Project Architecture

The application follows Clean Architecture with strict layering:

```
Repository (Mock / Catalyst Data Store)
    ↓
Service (Business Logic)
    ↓
Hooks (React State Management)
    ↓
UI Components (Stateless / Presentation)
```

All provider implementations (OCR, Entity Extraction, File Storage, Export) are abstracted behind interfaces — swapping Zoho Catalyst Zia or QuickML into production requires only replacing the provider files, leaving all business logic and UI untouched.

---

## Test Credentials (Mock Mode)

| KGID | Password | Role |
|---|---|---|
| `123456` | `password` | Sub-Inspector (Investigating Officer) |
| `999999` | `password` | DSP (Supervisor) |

---

## Repository Structure

```
src/
├── app/                        # Next.js App Router
├── components/                 # Shared UI components (Button, Input, ErrorBoundary)
├── features/
│   ├── auth/                   # Authentication context and hooks
│   ├── cases/                  # Case FIR workspace, CRUD, notes, activities
│   ├── evidence/               # Evidence Vault, custody timelines, media preview
│   ├── intelligence/           # AI OCR, entity extraction, review workflows
│   └── knowledge/              # Relationship graph, timelines, reports
└── lib/                        # Design system, locale provider, search service
knowledge-base/                 # Architecture documentation and deployment guide
prompts/                        # Sprint engineering prompts
```

---

## Code Quality

- ✅ Zero TypeScript errors
- ✅ Zero ESLint warnings
- ✅ 100% localization key coverage (English + Kannada)
- ✅ Catalyst-compatible static export build
