# Finalize and Create PR

Finalize an issue implementation — run checks, commit, push, and create a pull request.

## Input

Issue number: `$ARGUMENTS`

## Instructions

1. **Validate prerequisites**:
   - Work directory `.work/issue-$ARGUMENTS/` exists
   - Feature branch `feature/issue-$ARGUMENTS` is checked out
   - If a review exists at `.work/issue-$ARGUMENTS/review/implementation_review.md`, check that the score is ≥ 85%. If below 85%, warn the user and ask if they want to proceed anyway.

2. **Run quality checks**:

   ### Backend (if backend files were changed)
   - `cd backend && pip install -r requirements.txt` (ensure deps are installed)
   - Check for syntax errors: `python -m py_compile app/main.py` (and other .py files)

   ### Frontend (if frontend files were changed)
   - `cd frontend && npm install` (ensure deps are installed)
   - `cd frontend && npm run build` (verify the build succeeds)

   If any checks fail, report the errors and stop. Do not create a PR with broken code.

3. **Stage and commit**:
   - `git add` the relevant files (be specific, don't add `.work/` or `node_modules/`)
   - Create a commit with a clear message referencing the issue:
     ```
     <summary of what was done>

     Closes #$ARGUMENTS
     ```

4. **Push the feature branch**:
   ```
   git push -u origin feature/issue-$ARGUMENTS
   ```

5. **Create the pull request** using `gh pr create`:
   - Title: the issue title
   - Body should include:
     - Summary of changes (what and why)
     - Files changed
     - How to test
     - Link to the issue
     - `Closes #$ARGUMENTS`

6. **Create FINAL_REPORT.md** in `.work/issue-$ARGUMENTS/`:
   - Issue number and title
   - Summary of implementation
   - Files created/modified
   - PR link
   - Any known limitations or follow-up work

7. **Update the GitHub issue** with a comment linking to the PR.

## Output

Show the PR URL and a summary of what was shipped.
