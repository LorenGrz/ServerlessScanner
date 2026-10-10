# AGENTS.md

Single source of truth for humans and AI agents working on this repo. Moved here from CLAUDE.md on 2026-10-10 by `project-init`'s adopt mode - if this file and the code disagree, the code wins, fix this file.

## Documentation map (read this instead of the code)

1. `AGENTS.md` (this file) - map, how we work, workflow contract.
2. `.agents/CONTEXT.md` - current stack/architecture snapshot and repo facts.
3. `docs/plans/HANDOFF.md` - current state and how to resume, read first if work is mid-flight.
4. `docs/decisions/` - ADRs: why a non-trivial trade-off was decided the way it was.

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

## Workflow contract

These rules describe this repo's CURRENT reality, detected by `project-init`'s `adopt.sh` on 2026-10-10 - not an aspiration. If a row says "nothing (convention only)", that rule is not mechanically enforced today.

| Rule | Documented | Enforced by |
|---|---|---|
| Single branch flow - `main` is both base and release branch | this section | nothing (convention only) |
| Branch names observed: refactor/ (1) | this section | nothing (convention only) |
| Direct commits to `main` observed (5 of last 17 commits, no PR/merge-commit flow for most of them) | this section | nothing (convention only) |
| ~68% of the last 16 commit subjects on `main` are Conventional Commits | this section | nothing (convention only) |
| CI: Deploy to GitHub Pages (deploy-pages.yml): push,workflow_dispatch | this section | nothing requires it to pass before merge |
| Repo allows: squash=true, merge-commit=true, rebase=true; delete-branch-on-merge=false | this section | GitHub repo settings (`gh repo view`) |

Changing any rule above: update this table and every enforcement point in the same change, and record it in `docs/decisions/`.

### Recommended (not enforced yet)
- Branch protection on `main` (required status checks, no force-push).


## Documentation rules

- Any decision with a real trade-off (architecture, a hard-to-reverse library/service choice, data model, security trade-off) gets a new ADR under the ADR directory above.
- When work pauses mid-flight, update `docs/plans/HANDOFF.md` before stopping, not after.
- A change that alters architecture, env vars, commands, or deploy updates `AGENTS.md` and `.agents/CONTEXT.md` in the same change.
- Changing any "Workflow contract" rule updates every enforcement point in the same change, per that section above.
