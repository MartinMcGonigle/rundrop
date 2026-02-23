# Execute an Issue Plan

Execute the implementation plan for a GitHub issue using agent teams.

## Input

Issue number: `$ARGUMENTS`

## Instructions

1. **Validate prerequisites**:
   - Work directory `.work/issue-$ARGUMENTS/` must exist with planning documents
   - Feature branch `feature/issue-$ARGUMENTS` should be checked out
   - Read `implementation.md` to understand the execution order
   - If prerequisites are missing, tell the user to run `/plan $ARGUMENTS` first

2. **Read all planning documents** in `.work/issue-$ARGUMENTS/`:
   - `implementation.md` (master plan)
   - `backend_plan.md` (if exists)
   - `frontend_plan.md` (if exists)

3. **Determine execution strategy** based on what plan files exist:

   ### Backend-only issue (only `backend_plan.md`)
   - Spawn the `backend-engineer` agent with the full plan context
   - Agent implements changes in `backend/`

   ### Frontend-only issue (only `frontend_plan.md`)
   - Spawn the `frontend-engineer` agent with the full plan context
   - Agent implements changes in `frontend/src/`

   ### Full-stack issue (both plan files)
   - **Phase 1**: Spawn `backend-engineer` first (frontend often depends on API)
   - **Phase 2**: After backend completes, spawn `frontend-engineer`
   - If they're truly independent, run them in parallel

   ### Lead-owned issue (no agent plan files)
   - Execute the work directly (scaffolding, styling, deployment config)

4. **When spawning agents**, include in the prompt:
   - The full contents of their relevant plan file
   - The issue number and acceptance criteria
   - Instruction to commit with message referencing the issue (e.g., `Closes #$ARGUMENTS`)
   - Instruction to read the issue first with `gh issue view $ARGUMENTS`

5. **After execution completes**, create `.work/issue-$ARGUMENTS/execution_report.md`:
   - What was implemented
   - Files created or modified
   - Any deviations from the plan
   - Issues encountered
   - Status: success / partial / failed

6. **Update the GitHub issue** with a comment summarizing what was done:
   ```
   gh issue comment $ARGUMENTS --body "Implementation complete. See execution report."
   ```

## Output

Report execution results to the user — what was built, any issues, and next steps.
