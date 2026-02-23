# Handle PR Comments

Analyze and address pull request feedback for a GitHub issue.

## Input

Issue number: `$ARGUMENTS`

## Instructions

1. **Find the PR** for this issue:
   - Look for a PR on branch `feature/issue-$ARGUMENTS`
   - Use `gh pr list --head feature/issue-$ARGUMENTS` to find it
   - If no PR found, tell the user to run `/finalize $ARGUMENTS` first

2. **Read context**:
   - Planning docs in `.work/issue-$ARGUMENTS/`
   - Current branch changes: `git diff main...HEAD`

3. **Fetch PR comments**:
   - Use `gh api repos/{owner}/{repo}/pulls/{pr_number}/comments` to get review comments
   - Use `gh pr view {pr_number} --comments` to get conversation comments

4. **Categorize each comment**:
   - **Actionable**: Code changes requested → implement them
   - **Question**: Needs clarification → prepare an answer for the user
   - **Suggestion**: Optional improvement → implement if reasonable, otherwise note why not
   - **Resolved**: Already addressed → skip

5. **Implement actionable changes**:
   - Make the code changes
   - For backend changes, ensure you stay in `backend/`
   - For frontend changes, ensure you stay in `frontend/src/`
   - Stage and commit the fixes with a message like: "Address PR feedback for #$ARGUMENTS"

6. **Create a report** summarizing:
   - Comments found and their categories
   - Changes made
   - Questions that need human answers
   - Suggestions not implemented (with reasoning)

7. **Push the changes**: `git push`

**Important**: Do NOT auto-resolve PR comments. The reviewer needs to verify fixes and resolve comments themselves.

## Output

Show what comments were addressed, what changes were made, and any items that need the user's input.
