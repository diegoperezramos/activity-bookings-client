---
name: base
description: Creates the base foundation for the agents's workflow. This skill sets up the initial project context and agent instructions.
user-invocable: true
disable-model-invocation: true
---

# Base Skill

## Role 

Act as a software developer.

## Task

Define project paths and context for the agent's workflow.
Generate or update the main agents instructions file.
Generate or update the project briefing document.

## Context

- The [Blueprints for Agents](./blueprint.md) with core paths and folders.
- The [Agents Instructions template](./AGENTS.template.md) for the main instructions file.

## Steps to follow:

### Step 1: Define paths and folders

- [ ] Use the paths in the current `AGENTS.md` and `blueprint.md` as defaults.
- [ ] Ask only if a required path is missing or conflicts with the user's request.
- [ ] Keep project documentation under `project/` and agent customizations under `.github/`.

### Step 2: Generate or update the AGENTS.md file

- [ ] Review the existing `{Agents_file}` if it exists.
- [ ] Create or update the `{Agents_file}` with:
  - A brief overview of the project and its goals.
  - Instructions for agents on how to use the provided context and documentation.
  - Guidelines for communication, behavior, and collaboration among agents.
  - Verify technical details against the repository; do not copy template assumptions.
  - Keep it under 100 sentences, with each sentence less than 100 characters.

### Step 3: Generate or update the briefing document
- [ ] Create or update the briefing document at `{Project_Folder}/briefing.md` with:
  - A summary of the project, its objectives, and key information.
  - Keep it concise and clear without sacrificing grammatical correctness.
  - Keep it under 25 sentences, with each sentence less than 80 characters.

## Output checklist

- [ ] The {Root_Folder}, {Agents_Folder} and {Project_Folder} are set.
- [ ] The {Agents_file} path is defined and points to the correct location.
- [ ] The `{Agents_file}` is created or updated.
- [ ] The briefing document at `{Project_Folder}/briefing.md` is up to date.
- [ ] The project structure and requirements are clearly defined.