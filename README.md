# Serverless Scanner

**Serverless Scanner** is an executive-facing web app that analyzes existing SaaS
infrastructure and identifies the highest-ROI opportunities to migrate workloads
to serverless AWS services. It turns a complex architectural audit into a
prioritized, actionable roadmap.

Live demo (frontend): [https://lorengrz.github.io/ServerlessScanner/](https://lorengrz.github.io/ServerlessScanner/)

> **Status:** this repo is now **frontend-only**. The analysis engine (Bedrock /
> Claude prompt + scoring logic) was extracted into the reusable
> [`serverless-scanner` Claude skill](https://github.com/LorenGrz/claude-skills)
> and the AWS backend (Lambda + API Gateway + SAM) was decommissioned. The SPA is
> kept as a portfolio piece and UI reference; its `/api/scan` calls expect a
> backend at `VITE_API_URL` and will fail without one.

---

## The Problem It Solves

Most SaaS companies running on EC2 or traditional servers overpay for infrastructure because:

- Background jobs (email workers, report generators, webhook processors) sit **idle 70–90% of the time** but keep servers running 24/7.
- Engineering teams don't have time to audit every service and figure out what's safe to migrate vs. what should stay.
- Executives need cost projections and migration risk assessments, not raw architecture diagrams.

Serverless Scanner bridges that gap: it gives CTOs and engineering leads a **scored, risk-ranked migration plan**.

---

## Key Features (UI)

- **New Analysis** — upload architecture files (screenshots, diagrams, PDFs) + describe the stack; the scanner computes a readiness score.
- **Executive Dashboard** — Serverless Score (0–100), executive summary, estimated annual savings by service, savings-vs-complexity matrix, "Do Not Migrate" list.
- **Opportunity Detail** — per-workload fit score, target AWS architecture, phased timeline, SAM code preview.
- **30-Day Roadmap** — week-by-week migration checklist with per-phase status.
- **Export** — shareable PDF report of the full analysis.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Routing | React Router (hash-based SPA) |
| Hosting | GitHub Pages (`.github/workflows/deploy-pages.yml`) |
| Analysis engine | Extracted to the `serverless-scanner` Claude skill (was: AWS Lambda + API Gateway + SAM + Amazon Bedrock / Claude Haiku 4.5) |

---

## Project Structure

```
serverless-scanner/
└── frontend/                # React + TypeScript SPA (Vite)
    ├── src/
    │   ├── pages/           # Dashboard, NewAnalysis, Architecture, Roadmap, Export...
    │   ├── components/      # Layout, Sidebar, TopBar, BottomNav
    │   ├── data/            # Mock analysis data and types
    │   └── api.ts           # Calls VITE_API_URL (no backend deployed by default)
    └── vite.config.ts
```

---

## Run Locally

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Build (what CI deploys to GitHub Pages):

```bash
cd frontend
npx vite build --outDir dist
```

---

## License

MIT
