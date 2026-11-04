# Agents Instructions

- **Root folder**: `.`
- **Agents folder**: `.agents`
- **Agents file**: `AGENTS.md`
- **Project folder**: `project`

## Product Overview

Activity Bookings Client is a client for the Activity Bookings demo API.
It lets users discover activities, create bookings, and review their bookings.
The client is a JavaScript web app built with React.

## Technical Implementation

### Tech Stack

- **Language**: JavaScript.
- **Framework**: React with Vite as the recommended build tool.
- **Security**: Authenticate with the API's JWT tokens.
- **Testing**: Vitest and React Testing Library.
- **Logging**: Basic browser `console` methods; no extra logging dependency.

### Development workflow

The client has no implementation or package scripts yet.
Use Vite's React JavaScript template after reviewing existing root files.
Vitest is a good fit for Vite and supports jsdom for React component tests.
Current Vitest requires Vite 6.4+ and Node.js 22.12+.

Check existing root files before scaffolding into this non-empty repository.

```bash
# Create the React JavaScript app with Vite
npm create vite@latest . -- --template react
# Install client dependencies
npm install
# Add Vitest and React DOM testing tools
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
# Run the client in development
npm run dev
# Build the client
npm run build
# Run client tests once
npx vitest run
```

Run the API separately from its `activity-bookings-express` project folder
with `npm run dev`.

### Folder structure

```text
.                                  # Project root
├── AGENTS.md                      # Instructions for AI agents
├── .agents/
│   └── skills/
│       └── base/                  # Agent workflow skill and templates
├── project/
│   └── briefing.md                # Concise project summary
├── activitybookings-cli.briefing.md # Client exercise requirements
├── README.md                      # Course and exercise overview
└── LICENSE
```

## Environment

- **OS dev**: Windows
- **Terminal**: PowerShell
- **Git remote**: `https://github.com/diegoperezramos/activity-bookings-client`
- **Default branch**: `main`

## Behavior Guidelines

- Code and documentation must be in English.
- Chat responses must be in the language of the user prompt.
- Prefer concise, clear communication.
- Read the README and project briefings before making project decisions.
- Treat the API README and endpoint specifications as the API contract.
- Ask before making significant product or technology decisions.
- Preserve unrelated user changes and avoid inventing API behavior.
- Validate changes with relevant checks; report checks that were not run.
- Replace template placeholders with verified project details.

### Naming Conventions

Use hyphenated slugs for identifiers and non-code file names.
Prefix specifications, branches, and commit messages with:

- `feat`: New features or significant changes.
- `fix`: Bug fixes or minor improvements.
- `chore`: Routine tasks, maintenance, or non-functional changes.
