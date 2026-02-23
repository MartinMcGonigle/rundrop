# Review Implementation

Review the implementation quality for a GitHub issue against its plan.

## Input

Issue number: `$ARGUMENTS`

## Instructions

1. **Read context**:
   - GitHub issue: `gh issue view $ARGUMENTS`
   - Planning docs in `.work/issue-$ARGUMENTS/`
   - Execution report: `.work/issue-$ARGUMENTS/execution_report.md`

2. **Analyze the git changes**:
   - Run `git diff main...HEAD --stat` to see all changed files
   - Run `git diff main...HEAD` to review the actual code changes
   - Run `git log main..HEAD --oneline` to see commits

3. **Review each layer against its plan**:

   ### Backend Review (if `backend_plan.md` exists)
   - All planned endpoints implemented?
   - Error handling present for edge cases?
   - OSRM integration correct (async, proper URL, error handling)?
   - GPX export working?
   - No unnecessary dependencies added?

   ### Frontend Review (if `frontend_plan.md` exists)
   - All planned components created?
   - State management follows the spec's state machine?
   - Map interactions working (click, marker, polyline)?
   - Responsive layout considerations?
   - No TypeScript (project uses plain JSX)?

4. **Calculate implementation score** (target: 85%+):
   - **Plan compliance** (30%) — Does the code match what was planned?
   - **Code quality** (25%) — Clean, readable, follows project conventions?
   - **Error handling** (20%) — Edge cases covered, user-facing messages clear?
   - **Completeness** (25%) — All acceptance criteria from the issue met?

5. **Create review document** at `.work/issue-$ARGUMENTS/review/implementation_review.md`:
   - Per-layer compliance scores
   - Issues found (critical, major, minor)
   - Recommendations
   - Overall score
   - Verdict: PASS (≥85%) / NEEDS WORK (<85%)

6. **Report results**:
   - If PASS: recommend proceeding to `/finalize $ARGUMENTS`
   - If NEEDS WORK: list the specific issues to fix before finalizing

## Output

Show the implementation score, any issues found, and recommended next steps.
