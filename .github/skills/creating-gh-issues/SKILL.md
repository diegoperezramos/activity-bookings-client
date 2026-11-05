---
name: creating-gh-issues
description: >
  Creates a GitHub issue based on a provided specification or context.
  To be used to create issues for features, bug corrections, or enhancements.
---

# Creating GitHub Issues Skill

When asked for creating a GitHub issue, follow these steps:

1. **Capture inputs**:
  - Draft the issue title from the specification or context; if unclear, ask.
  - Identify the repo remote URL from Context. 
  - If not, identify it by using local git commands to get the remote URL.
    - Save the remote URL at [AGENTS.md](../../../AGENTS.md) for later use.
   
2. **Create the GitHub issue**:
  - Use an available, authorized GitHub issue-creation tool for the current repository.
  - If issue creation is unavailable, provide the proposed title and body without
    claiming that an issue was created.
  - Set the issue title and body based on the provided specification or context.
  - Apply only labels that already exist in the repository and fit the issue.
  - Save the created issue URL for reference and the ID for tracking.

3. **Double-link to specification (if applicable)**:
  - If the issue is created based on a specification file:
    - Add the created issue URL back to the file for traceability.
    - Add a repository link to the specification in the created issue body for context.
  - Describe the client behavior and API interactions; do not report backend behavior
    as a client requirement unless the API contract documents it.