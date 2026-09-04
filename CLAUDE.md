# Contexto del proyecto

**Serverless Scanner**: app web orientada a ejecutivos que analiza la
infraestructura SaaS existente de una empresa y prioriza qué migrar a AWS
serverless por ROI. Sube diagramas/capturas de arquitectura + descripción del
stack → calcula un "Serverless Score" (0-100), ahorro anual estimado,
matriz ahorro/complejidad, arquitectura AWS objetivo por servicio (con
preview de código SAM), roadmap de migración a 30 días con checklist por
fase, y sección "Do Not Migrate" con servicios que no conviene tocar y por
qué.

**Demo en vivo:** https://mfg9vwkgld.execute-api.us-east-1.amazonaws.com/prod/

## Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Router
  (hash-based, SPA servida desde Lambda).
- Backend: AWS Lambda (Node.js 22.x, `arm64`, response streaming), API
  Gateway REST, AWS SAM.
- IA: **Amazon Bedrock, Claude Haiku 4.5** (reemplazó un mock inicial —
  ver historial de commits, migró de mock a Bedrock real).
- Gestor de paquetes: **npm** en el frontend (`package-lock.json` tracked) —
  no pnpm, aunque el repo tiene un `pnpm-lock.yaml`/`pnpm-workspace.yaml`
  sueltos y sin trackear (parecen accidentales, no se tocaron).

## Repos relacionados

- `serverless-scanner-skill`: el skill de Claude para migrar detectar
  oportunidades serverless (`serverless-scanner` en la lista de skills
  globales), probablemente derivado de la lógica de análisis de este proyecto.
- `landing-serverlessscanner`: landing estática de portfolio.

## Última revisión

2026-09-04 — primera vez que se documenta en CLAUDE.md. Al momento de
escribir esto había un cambio sin commitear en `backend/src/index.mjs` y los
dos archivos de pnpm sueltos en `frontend/` mencionados arriba — no se
tocaron, quedan para que Loren los revise.
