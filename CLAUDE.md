# Contexto del proyecto

**Serverless Scanner**: SPA orientada a ejecutivos que analiza la infraestructura
SaaS de una empresa y prioriza qué migrar a AWS serverless por ROI (Serverless
Score 0-100, ahorro anual estimado, matriz ahorro/complejidad, arquitectura AWS
objetivo por servicio, roadmap de 30 días, sección "Do Not Migrate").

**Este repo es solo frontend.** La lógica de análisis (prompt de Bedrock/Claude +
scoring) se extrajo al skill `serverless-scanner`
(`github.com/LorenGrz/claude-skills`). El backend AWS (Lambda + API Gateway + SAM
+ Bedrock Claude Haiku 4.5) se dio de baja.

**Demo (frontend):** https://lorengrz.github.io/ServerlessScanner/

## Stack

- React 18, TypeScript, Vite, Tailwind CSS, React Router (hash-based SPA).
- Deploy: GitHub Pages vía `.github/workflows/deploy-pages.yml` (build de
  `frontend/` con `vite build --outDir dist`, push a `main`).
- Gestor de paquetes: **npm** en `frontend/` (`package-lock.json` tracked). Hay
  un `pnpm-lock.yaml`/`pnpm-workspace.yaml` sueltos y sin trackear en `frontend/`
  que parecen accidentales — no se tocaron.
- `frontend/src/api.ts` apunta a `VITE_API_URL`, con un fallback a una API
  Gateway que ya no existe. Sin backend, las llamadas a `/api/scan` fallan; la
  SPA se mantiene como pieza de portfolio / referencia de UI.

## Repos relacionados

- `serverless-scanner-skill` / skill `serverless-scanner`: la lógica de análisis
  ya vive ahí.
- `landing-serverlessscanner`: landing estática (GitHub Pages), sin AWS.

## Última revisión

2026-09-07 — se dio de baja el backend de AWS y quedó el repo solo con
`frontend/`.

- `sam delete` del stack `serverless-scanner` (Lambda + API Gateway + rol IAM +
  log group). No tenía DB ni secrets.
- Se borraron `template.yaml`, `samconfig.toml`, `backend/` y `.aws-sam/` del
  repo; `.gitignore` limpio de la entrada `.aws-sam/`.
- El análisis quedó cubierto por el skill `serverless-scanner`.
