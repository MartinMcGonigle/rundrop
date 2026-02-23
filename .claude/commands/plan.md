# Plan an Issue

Read a GitHub issue and create a comprehensive implementation plan.

## Input

Issue number: `$ARGUMENTS`

## Instructions

1. **Read the GitHub issue** using `gh issue view $ARGUMENTS` to get full requirements.

2. **Read the project plan** at `PLAN.md` for overall architecture and tech decisions.

3. **Explore the current codebase** to understand what already exists — check `backend/`, `frontend/`, and any relevant files.

4. **Create a work directory** at `.work/issue-$ARGUMENTS/` for all planning artifacts.

5. **Create a feature branch**: `git checkout -b feature/issue-$ARGUMENTS`

6. **Determine which agents are needed** by checking the issue's label:
   - `backend` label → create `backend_plan.md`
   - `frontend` label → create `frontend_plan.md`
   - `lead` label → plan the work yourself (scaffolding, styling, deployment)
   - If the issue spans both, create both plan files

7. **Generate planning documents** in `.work/issue-$ARGUMENTS/`:

   ### `backend_plan.md` (if applicable)
   - Files to create or modify (with full paths)
   - Function/class signatures
   - OSRM API integration details
   - Error handling approach
   - Test scenarios

   ### `frontend_plan.md` (if applicable)
   - Components to create or modify (with full paths)
   - Props and state specifications
   - UI behavior and interactions
   - CSS/styling approach
   - Test scenarios

   ### `implementation.md` (always created — master plan)
   - Summary of the issue requirements
   - Implementation order (what depends on what)
   - Integration points between backend and frontend
   - Acceptance criteria from the issue
   - Confidence assessment (see below)

8. **Assess confidence** (target: 80%+):
   - Clarity of requirements (25%)
   - Understanding of integration points (25%)
   - Technical implementation clarity (25%)
   - Risk assessment (25%)

   If confidence is below 80%, list specific clarifying questions and ask the user before proceeding.

9. **Report the plan** — show a summary of what will be built, which agents will be involved, and the confidence score.

## Output

After completion, the `.work/issue-$ARGUMENTS/` directory should contain the planning documents and the feature branch should be checked out.
