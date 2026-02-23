# Project Status

Show the current status of all GitHub issues and work progress.

## Instructions

1. **List all issues** with their status:
   ```
   gh issue list --state all --limit 20
   ```

2. **Check for open PRs**:
   ```
   gh pr list --state all
   ```

3. **Check current branch and working tree**:
   ```
   git status
   git branch -a
   ```

4. **Check for work directories**:
   - List any `.work/issue-*/` directories that exist
   - For each, note what planning/execution artifacts are present

5. **Present a summary table**:

   | Issue | Title | Label | Status | Branch | Plan | Executed | PR |
   |-------|-------|-------|--------|--------|------|----------|----|

   Fill in:
   - Status: open/closed from GitHub
   - Branch: does `feature/issue-N` exist?
   - Plan: does `.work/issue-N/implementation.md` exist?
   - Executed: does `.work/issue-N/execution_report.md` exist?
   - PR: is there an open PR for this issue?

6. **Recommend next steps** — what should be worked on next based on issue dependencies and current progress.
