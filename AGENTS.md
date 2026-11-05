# Agents Instructions

## Project Overview
- Activity Bookings Client is a React web client for the demo Activity Bookings API.
- It supports activity discovery, account access, bookings, and booking-status review.
- The client is for training and demos, not production use.

## Technical Implementation
- **Language:** JavaScript with ES modules.
- **Framework:** React 19 and Vite 8.
- **API:** External Activity Bookings API at `http://localhost:3000` during local development.
- **Security:** Use the API's JWT for protected booking requests.
- **Testing:** Vitest, jsdom, and React Testing Library.
- **Logging:** Use browser `console` methods when needed; add no logging package.
- Use browser `fetch` for API calls; avoid extra runtime packages without a clear need.
- Treat the API README and endpoint specifications as authoritative.
- Do not assume undocumented API behavior or change the backend.
- Do not invent token storage, expiry, refresh, or logout behavior.

## Development Workflow
- Install dependencies with `npm install`.
- Run the client with `npm run dev`.
- Build with `npm run build`; preview with `npm run preview`.
- Run tests with `npm test`; use `npm run test:unit` for unit tests.
- Run the API separately from its `activity-bookings-express` project folder.
- The repository has a minimal React application foundation and existing package scripts.
- Check existing files before scaffolding or changing project structure.

## Folder Structure
- Repository root: `.`; agent customizations: `.github/`; project documents: `project/`.
```text
.
├── .github/                 # Agent definitions and skills
├── src/                     # React application, API client, and tests
├── project/                 # Briefing, requirements, architecture, and specifications
│   ├── PRD.md
│   ├── ADD.md
│   ├── briefing.md
│   └── specs/                 # Feature specifications
├── activitybookings-cli.briefing.md
├── index.html               # Vite application entry document
├── .env.example             # Example API URL configuration
├── package.json             # Existing dependencies and scripts
├── README.md
└── AGENTS.md
```

## Environment and Behavior
- Development environment: Windows with PowerShell.
- Default git branch: `main`.
- Read the README and project briefings before making project decisions.
- Ask before making significant product or technology decisions.
- Preserve unrelated changes and validate relevant behavior.
- Report checks that were not run.
- Code and documentation must be in English.
- Respond in the user's language and prefer concise communication.

## Naming Conventions
- Use hyphenated slugs for identifiers and non-code file names.
- Prefix specifications, branches, and commits with `feat`, `fix`, or `chore`.
