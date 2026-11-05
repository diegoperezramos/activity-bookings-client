---
description: Create the React entry point, API base URL config, shared fetch helper, and an API health indicator.
agent: agent
model: Copilot Fusion
tools: ['read', 'edit', 'search', 'execute', 'todo']
---
# Client Foundation

## Role

Act as a software developer. 

Set up the minimal foundation of the Activity Bookings Client before any feature work.

## Context

- Read `AGENTS.md`, `project/ADD.md`, and `project/PRD.md` first and respect them.
- The repository has `package.json` with React, Vite, and Vitest, but no application source yet.
- Check existing root files before creating anything; do not re-scaffold or add dependencies.
- The API is external and runs at `http://localhost:3000`.
- Its documented health endpoint is `GET /health`, which answers `{ "status": "ok" }`.
- Do not assume undocumented API behavior or change the backend.

## Tasks

1. **Entry point**
   - Add the Vite `index.html` and a React entry (`src/main.jsx`) that renders a root `App` component.
   - Add `vite.config.js` with the React plugin and the Vitest `jsdom` environment, plus a test setup file that loads `@testing-library/jest-dom`.
   - Keep `npm run dev`, `npm run build`, and `npm test` working with the existing scripts.

2. **API URL configuration**
   - Read the base URL from `import.meta.env.VITE_API_URL`, defaulting to `http://localhost:3000`.
   - Centralize it in one small config module (e.g., `src/config.js`).
   - Add a `.env.example` documenting `VITE_API_URL`; do not commit real `.env` files.

3. **Shared fetch helper**
   - Add a small module (e.g., `src/api/client.js`) exposing one function such as `apiFetch(path, options)`.
   - Prefix the path with the configured base URL and parse JSON responses.
   - Throw a clear `Error` carrying the HTTP status when the response is not `ok`.
   - Accept an optional JWT and send it as an `Authorization: Bearer` header when provided.
   - Do not decide token storage, expiry, or refresh behavior.
   - Add no extra runtime packages.

4. **Initial screen with health indicator**
   - `App` shows the app title and a simple status pilot (colored dot plus text label).
   - On load, call `GET /health` through the shared helper.
   - States: `checking` (neutral), `available` (green, response status `ok`), `unavailable` (red, request failed or other status).
   - Include a button to re-check availability.
   - Make the indicator accessible: use a text label and `role="status"`, not color alone.
   - Log failures with `console` methods only; no logging package.

5. **Tests**
   - Use Vitest and React Testing Library, following the `testing-ui-react` and `testing-unit` skills.
   - Unit test the fetch helper: URL prefixing, JSON parsing, error on non-OK status, optional auth header.
   - Component test the pilot: checking, available, unavailable, and re-check; mock `fetch`, never call the real API.

## Constraints

- JavaScript only (ES modules), React 19, Vite 8; keep code small and proportionate to a demo client.
- Code and documentation in English; comment only code that needs clarification.
- Do not implement activity, authentication, or booking features.

## Validation

- Run `npm test` and `npm run build`; fix failures.
- Start `npm run dev` and confirm the page loads; verify the pilot against the running API if available, otherwise confirm it shows `unavailable`.
- Update the `AGENTS.md` folder structure and the PRD/ADD statements only where they became stale (for example, "no application source yet").
- Report any checks that could not be run.
