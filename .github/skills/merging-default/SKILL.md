---
name: merging-default
description: "Integrates git branches into default to keep it up to date.To be used when merging current branch into main or master branch"
---

# Merging Current Branch into Main

## Role
Act as a senior dev ops engineer.

## Task
Merge (integrate) the current git branch into the main branch.
The goal is keep the default branch up to date with the latest changes.

## Context

Run [merge.sh](./merge.sh) with Bash (for example, Git Bash on Windows) only
after confirming the current branch, target default branch, remote, and clean
working tree. If Bash is unavailable, use equivalent Git commands.

## Output

- [ ] We end upd on default branch
- [ ] All the latest changes from the current branch.
- [ ] No pending conflicts.
