# Serverless Scanner

**Serverless Scanner** is an executive-facing web app that analyzes your existing SaaS infrastructure and identifies the highest-ROI opportunities to migrate workloads to serverless AWS services. It turns a complex architectural audit into a prioritized, actionable roadmap — in minutes.

Live demo: [https://mfg9vwkgld.execute-api.us-east-1.amazonaws.com/prod/](https://mfg9vwkgld.execute-api.us-east-1.amazonaws.com/prod/)

---

## The Problem It Solves

Most SaaS companies running on EC2 or traditional servers overpay for infrastructure because:

- Background jobs (email workers, report generators, webhook processors) sit **idle 70–90% of the time** but keep servers running 24/7.
- Engineering teams don't have time to audit every service and figure out what's safe to migrate vs. what should stay.
- Executives need cost projections and migration risk assessments, not raw architecture diagrams.

Serverless Scanner bridges that gap: it gives CTOs and engineering leads a **scored, risk-ranked migration plan** they can act on immediately.

---

## Use Cases

| Who | What they get |
|---|---|
| CTO / VP Engineering | An executive dashboard with a serverless readiness score, estimated annual savings, and a 30-day migration roadmap |
| Solutions Architect | Per-service technical plans with target AWS architecture, SAM code previews, and complexity/risk ratings |
| SaaS Founder | A clear "migrate this, don't touch that" breakdown with financial justification for each decision |

---

## Key Features

### New Analysis
Upload your system architecture files (screenshots, diagrams, PDFs) and describe your tech stack. The scanner calculates a **readiness score** and kicks off the analysis.

### Executive Dashboard
The main results screen shows:
- **Serverless Score** (0–100) — how migration-ready your infrastructure is
- **Executive Summary** — plain-language explanation of the findings
- **Estimated annual savings** — broken down by service
- **Savings vs Complexity Matrix** — visual scatter plot to prioritize opportunities at a glance
- **Do Not Migrate** section — services flagged as risky or unsuitable, with a reasoned explanation and a suggested revisit date

### Opportunity Detail
Each migration opportunity includes:
- Fit score and savings estimate
- Target AWS architecture (e.g. EventBridge + Lambda + SES)
- Visual architecture diagram for the proposed serverless design
- Phased migration timeline (days to completion per phase)
- SAM (Serverless Application Model) code preview — ready to deploy

### Architecture View
Diagram view of the proposed serverless target architecture for each workload.

### 30-Day Roadmap
A week-by-week checklist of migration tasks, from IAM provisioning to cutover and decommission. Each phase has a status (Scheduled / Pending / Roadmap) so teams know exactly where they stand.

### Export
Generate a shareable PDF report of the full analysis for stakeholders.

---

## Example Analysis Output

For a **Gym Booking SaaS** running React + Express + PostgreSQL + Stripe:

| Opportunity | AWS Target | Monthly Savings | Complexity | Risk |
|---|---|---|---|---|
| Email Reminders | EventBridge + Lambda + SES | $1,155 | Low | Low |
| Stripe Webhooks | API Gateway + Lambda + DynamoDB | $380 | Low | Low |
| Monthly Reports | EventBridge + Lambda + S3 | $620 | Medium | Medium |

**Total estimated annual savings: $42,500**

Services flagged as *do not migrate*:
- **Core Booking Database** — PostgreSQL with complex slot-locking; migrating risks booking integrity
- **Real-time Trainer Notifications** — requires persistent WebSocket state, unsuitable for Lambda

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | AWS Lambda (Node.js 22.x, arm64), response streaming |
| API | Amazon API Gateway (REST) |
| IaC | AWS SAM (Serverless Application Model) |
| Routing | React Router (hash-based for SPA on Lambda) |

---

## Project Structure

```
serverless-scanner/
├── frontend/               # React + TypeScript SPA
│   ├── src/
│   │   ├── pages/          # Dashboard, NewAnalysis, Architecture, Roadmap, Export...
│   │   ├── components/     # Layout, Sidebar, TopBar, BottomNav
│   │   └── data/           # Mock analysis data and types
│   └── vite.config.ts
├── backend/
│   └── src/
│       ├── index.mjs       # Lambda handler — serves static files + API routes
│       └── public/         # Built frontend assets (copied here for deployment)
├── template.yaml           # SAM infrastructure definition
└── samconfig.toml          # SAM deploy configuration
```

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- AWS SAM CLI
- AWS credentials configured

### 1. Install and run the frontend dev server

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

### 2. Build the frontend for deployment

```bash
cd frontend
npm run build
cp -r dist/* ../backend/src/public/
```

### 3. Deploy to AWS

```bash
sam build
sam deploy
```

SAM will output the live URL:

```
AppUrl: https://<api-id>.execute-api.us-east-1.amazonaws.com/prod/
```

---

## How the Backend Works

The Lambda function (`backend/src/index.mjs`) acts as a single handler for the entire app using **response streaming**:

- `POST /api/scan` — returns a mock analysis result (JSON)
- `POST /api/export` — returns a mock report URL
- All other routes — serves static files from the bundled frontend, with SPA fallback to `index.html`

This means the entire app (frontend + API) runs as a single Lambda function behind API Gateway, keeping infrastructure minimal and costs near zero at low traffic.

---

## License

MIT
