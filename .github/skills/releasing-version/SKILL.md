---
name: releasing-version
description: "Updates documentation, generates changelogs, and handles versioning. To be used for automating release tasks."
---

# Releasing Version Skill

Automate the process of managing releases, including:
  - updating documentation,
  - generating changelogs,
  - and handling versioning.

Use terminal git commands as needed.
This repository's package is currently private. Do not publish it to a package
registry. Confirm the intended release/versioning scheme before preparing a release.

## Step 1: Update Documentation

- [ ] [AGENTS.md](../../../AGENTS.md) : update to reflect changes.
  - tech stack,
  - setup/dev instructions,
  - folder structure are accurate.
- [ ] Other relevant project files.

## Step 2: Generate Changelog

- [ ] Summarize relevant changes from commit history; do not commit pending work automatically.
- [ ] Use [Semantic Versioning (SemVer)](./sem-ver.md) principles.
- [ ] Create or update `CHANGELOG.md` only if a changelog is part of the requested release.
  - Never include unrelated pending changes.

## Step 3: Versioning

- [ ] Update `package.json` only if a release version is requested.
- [ ] Commit, merge into the default branch, or create a tag only when explicitly requested.
- [ ] If an issue/ticket ID is provided, include `Close #ID` only in the requested commit or PR.
