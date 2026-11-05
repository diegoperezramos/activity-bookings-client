---
name: planning-specs
description: "Creates a detailed implementation plan for a given feature specification. To be used for planning the implementation of feature specifications."
---

# Generate Plan Skill

Write a detailed implementation plan for a given feature specification.

The plan will be a set of ordered steps, each with specific tasks to complete.

## Context

- The specification file at `project/specs/<spec-slug-id>.spec.md`.
- `project/ADD.md`, if it exists.
- Existing source files, `package.json`, project instructions, and the API contract.

## Steps to follow:

### Step 1: Think about the overall implementation.
 - [ ] Understand the specification requirements.
 - [ ] Consider the architecture and design constraints from the ADD.
 - [ ] Choose the simplest viable approach to implement the spec.
 - [ ] Follow the established JavaScript, React, Vite, and Vitest patterns.
 - [ ] Keep changes in the client; do not plan undocumented backend changes.
### Step 2: Decompose the implementation in steps.
 - [ ] Break down the implementation into 3 to 9 steps 
 - [ ] Ensure each step is an ordered logical unit of work.
### Step 3: Define tasks for each step.
 - [ ] For each step, list specific tasks (<= 5) needed to complete it.
 - [ ] Ensure tasks are clear and actionable.
### Step 4: Write the implementation plan.
 - [ ] Follow the format in the [Implementation Plan template](plan.md).
 - [ ] Write the plan to `project/specs/<spec-slug-id>.plan.md`.
### Step 5: Review and finalize the plan.
 - [ ] Ensure the plan is comprehensive and feasible.
 - [ ] Mark the specification status as "Planned" at the top of the spec file.

## Output Checklist

- [ ] A detailed implementation plan at `project/specs/<spec-slug-id>.plan.md`.
- [ ] The specification status updated to "Planned" in the spec file.