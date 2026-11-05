---
name: generating-specs
description: "Writes the specification with problem definition, solution outline, and acceptance criteria. To be used to specify a feature, bug correction, or enhancement."
---

# Generating Specs Skill

Write the specification to implement a feature, bug correction, or enhancement.

Include the problem definition, solution overview, and acceptance criteria.

Keep the problem definition clear, concise, and focused.

Do not enter implementation details.

Make the acceptance criteria specific, and testable.

Do not write any code or tests, just the specification.

## Context

- `project/PRD.md`, if it exists.

The feature, bug correction, or enhancement must be provided in the input.

If not, ask for it before proceeding.

Types of specifications to generate include:
- New or current feature : `feat`
- Bug correction : `fix`
- Enhancement or refactor : `chore`

Specify client behavior and its interaction with the API. Treat the API README
and endpoint specifications as the contract; do not invent backend behavior.

### Specification output template

Read and follow the specific [spec template](spec.md) to generate the document.

## Steps to follow:

### Step 1: Capture inputs:
  - [ ] Confirm feat/fix/chore to specify; if missing, ask.
  - [ ] Draft the issue title from the request; if unclear, ask.
### Step 2: Review PRD (if applicable):
  - [ ] If a PRD exists, check whether it already covers the change.
  - [ ] If it is, use that information to help you write the specification.
  - [ ] If it does not, confirm any PRD scope change with the user; do not silently
        expand product scope or create a missing PRD as a side effect.
  - [ ] If no PRD exists, use the project briefings and API contract as context.
### Step 3: Define the Problem: 
  - [ ] Clearly outline the problem that we aim to solve.
### Step 4: List User Stories: 
  - [ ] Up to 3 US that describe the problem from the user's perspective.
### Step 5: Outline the Solution: 
  - [ ] Describe the simplest approach without technical details for:
    - User/App interface
    - Model and logic
    - Persistence
### Step 6: Set Acceptance Criteria: 
  - [ ] Up to 9 criteria in EARS format that define when the spec is complete.
  - [ ] Follow the [EARS format guide](EARS.md).
### Step 7: Generate an spec-slug-id:
  - [ ] Create a short-name identifier for the spec based on the type and title.
  - [ ] Example: `feat-booking-management`.
### Step 8: Write the Specification: 
  - [ ] Use short sentences and bullet points where possible.
  - [ ] Keep the specification concise but complete.
  - [ ] Follow the [spec template](spec.md)
  - [ ] Write it in markdown format at `project/specs/<spec-slug-id>.spec.md`.

## Output Checklist

- [ ] A specification markdown file named `project/specs/<spec-slug-id>.spec.md`.
- [ ] The PRD requirements status must be updated if needed.