# Agents Instructions

## Product Overview
- {Product name} is a {short description of product}.
- {Additional key features or characteristics of the product.}
  
## Technical Implementation

### Tech Stack
- **Language**: {language and version}
- **Framework**: {framework and version}
- **API/Backend**: {external API or backend, if applicable}
- **Security**: {security strategy}
- **Testing**: {testing framework }
- **Logging**: {logging tool }

### Development workflow

```bash
# Set up the project
# Build/Compile the project
# Run the project
# Test the project
# Deploy the project
```

### Folder structure
```text
.                         # Project root  
├── AGENTS.md             # This file with instructions for AI agents
├── .github/              # Repository agent customizations
|   ├── agents/           # Custom agent definitions
|   └── skills/           # Custom agent skills
├── project/              # Project context and design documents
|   ├── briefing.md       # Concise project summary
|   ├── PRD.md            # Product Requirements Document
|   ├── ADD.md            # Architectural Design Document 
|   ├── ERM.md            # Entity-relationship model
|   └── specs/            # Specifications and plans
├── CHANGELOG.md          # Project history and changelog
├── README.md             # Human friendly project overview
├── src/                  # Source code folder
├── tests/                # Test files
└── other_files/          # Other relevant files and folders 
```

## Environment
- Development environment: Windows with PowerShell.
- Default git branch is `main` unless specified otherwise.
- Mind the available **agent skills** when performing tasks.

## Behavior Guidelines
- Code and documentation must be in English.
- Chat responses must be in the language of the user prompt.
- Sacrifice grammar for conciseness when needed to fit response limits.
- When using templates, ensure to replace {placeholders} with actual values.

### Naming Conventions

Use slugs with hyphens for any identifiers or non code file names.

Use this table to determine the prefixes :

| Spec        | GitHub Label  | Git Branch    | Commit  |
|-------------|---------------|---------------|---------|
| feat-<slug> | enhancement   | feat/<slug>   | feat:   |
| bug-<slug>  | bug           | fix/<slug>    | fix:    |
| chore-<slug>| chore         | chore/<slug>  | chore:  |
