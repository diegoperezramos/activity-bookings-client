---
name: commit-changes
description: "Commits pending changes. To be used for committing code changes in a git repository."
---

# Committing Changes Skill

When asked for committing changes, follow these steps:

1. **Check for uncommitted changes**:
  - Review `git status` and both staged and unstaged diffs.
  - Preserve unrelated user changes; stage only files in the requested change.
2. **Group changes**:
  - If there are multiple files changed, group them logically if possible.
  - Decide on meaningful commit messages for each group.
3. **Stage changes**:
  - Stage the changes using `git add` for each group of files.
4. **Commit changes**:
  - Commit the staged changes using [conventional commit messages](./conventional-commits.md) guidelines.
5. **Merge only when requested**:
   - Do not switch branches or merge as part of an ordinary commit.
   - Merge only when the user explicitly requests it, using the repository's default branch.