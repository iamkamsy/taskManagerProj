# Claude Code Development Steps

## Objective
Use this checklist to keep development smooth, local-first, and decision-driven by the user while building the Personal Task Manager Web App.

## 1. Work Only in This Repo
- Confirm the working directory is `C:\Users\kamsy\projects\taskManagerProj`.
- Read the current docs before making changes.
- Run `git status` before editing and avoid unrelated files.
- Keep all new files and edits inside this repository only.

## 2. Start With User-Controlled Planning
- Read the PRD and summarize the next implementation slice before coding.
- Ask the user for approval on major decisions before locking them in.
- Do not silently choose architecture when tradeoffs are meaningful.
- Keep a short running plan so the current milestone is always clear.

## 3. Ask Key Design Questions Along the Way
Claude should pause and ask the user about major decisions such as:

- Should authentication use JWT, secure cookies, or Flask session storage?
- What fields should sign up require on day one?
- Should the app support password confirmation, password rules, and forgot-password flows now or later?
- Should task editing happen inline, in a modal, or on a separate page?
- Should task deletion be part of version one or deferred?
- Should deadlines include time-of-day or date only?
- Should the frontend styling use plain CSS, CSS modules, Tailwind, or a component library?
- Should the backend be a single Flask app first or use blueprints from the start?
- How should local environment variables and secrets be organized?
- When local testing is complete, what hosting path should be used for AWS readiness?

Claude should make reasonable assumptions only for low-risk details. For major product, security, UX, database, and deployment decisions, it should ask first.

## 4. Build Locally First
- Scaffold the project for local development before thinking about cloud deployment.
- Run frontend and backend locally.
- Connect the backend to MongoDB Atlas and verify reads and writes locally.
- Confirm the auth flow works locally from browser to database.
- Confirm task creation and task editing work locally without refresh.
- Confirm task sorting updates locally after create and edit actions.
- Confirm logout returns the user to the auth landing page.
- Use frontend design review during local development to confirm spacing, typography, layout consistency, responsiveness, and overall adherence to the intended styling guidelines.
- Use the Playwright CLI during local development to exercise the main user flows in a real browser environment.

Local functionality is the gate. Do not shift focus to cloud hosting readiness until the local app is working end to end.

## 5. Implement the App in the Right Order

### Phase 1: Foundation
- Create a clean structure for frontend, backend, docs, and configuration.
- Add environment variable templates.
- Define the user model and task model.
- Define the task fields exactly as:
  - task name
  - task deadline
  - task description

### Phase 2: Authentication Gate
- Build the landing page with `Log In` and `Sign Up`.
- Prevent unauthenticated access to the task manager.
- Implement sign up, log in, auth persistence, and log out.
- Confirm logout routes the user back to the opening auth screen.
- Use frontend design review to verify the auth page matches the chosen visual direction and remains clear on both desktop and mobile.
- Add or run Playwright coverage for opening the app, signing up, logging in, protected-route behavior, and logging out.

### Phase 3: Personal Task Access
- Build task APIs scoped to the authenticated user only.
- Make sure one user can never read another user's task list.
- Add backend validation and ownership checks on every task route.

### Phase 4: Task Creation and Display
- Implement task creation with the required three fields.
- Load tasks immediately after login.
- Sort tasks by nearest deadline first.
- Update the UI immediately after successful task creation without refresh.
- Use frontend design review to verify the task form, task list hierarchy, buttons, spacing, and deadline visibility follow the styling guidelines.
- Use the Playwright CLI to test task creation and confirm that new tasks appear immediately without a browser refresh.

### Phase 5: Task Editing
- Add an edit button for each task.
- Allow editing of all task fields.
- Update the task list immediately after save without refresh.
- Re-sort tasks automatically after edits are saved.
- Use frontend design review to verify the edit interaction is visually consistent and understandable.
- Use the Playwright CLI to test task editing and confirm that edited tasks re-sort correctly without refresh.

### Phase 6: Hardening
- Add input validation, auth checks, and error states.
- Test multiple accounts to confirm privacy boundaries.
- Improve mobile responsiveness and accessibility basics.
- Use frontend design review to check mobile layouts, error messaging clarity, and accessibility-related styling details.
- Use the Playwright CLI to validate negative flows such as invalid login, invalid task submission, and user-to-user isolation checks where feasible.

### Phase 7: Cloud-Readiness
- Only after local verification, prepare environment separation for hosted deployment.
- Add deployment configuration for backend and frontend.
- Document the path from local setup to AWS hosting.

## 6. Keep the UI Reactive
- Treat no-refresh behavior as a first-class requirement.
- After creating a task, update the visible task list immediately.
- After editing a task, update the visible task list immediately.
- Re-run deadline sorting after every create or edit success.
- Avoid any workflow that requires manual browser refresh to see correct data.

## 7. Protect Privacy and Security
- Hash passwords securely.
- Never expose task routes to unauthenticated users.
- Filter all task queries by authenticated user identity.
- Validate task name, deadline, and description on the backend.
- Test with at least two accounts to verify strict data isolation.

## 8. Verify at Every Milestone
- After auth work, test sign up, log in, route protection, and log out.
- After task creation work, test database persistence and automatic list updates.
- After task editing work, test automatic updates and re-sorting.
- After privacy work, test that users cannot access each other's tasks.
- After UI work, test desktop and mobile layouts.
- For every milestone, include a frontend design pass so UI quality and styling consistency are checked continuously rather than saved for the end.
- For every milestone, run the relevant Playwright CLI flows and treat failures as blockers until resolved or explicitly accepted by the user.

## 9. Preferred Claude Code Behavior
- Before coding: inspect relevant files and explain the intended change briefly.
- Before major decisions: ask the user and wait for direction.
- During coding: edit only the files needed for the current slice.
- During frontend work: use frontend design review to confirm the implementation follows the agreed styling guidelines and interaction patterns.
- After coding: run focused checks first, then broader validation, including Playwright CLI tests for the affected user flows.
- After validation: summarize what changed, what was tested, and what still needs user input.

## 10. Definition of Smooth Development
- The user remains in control of major system design and implementation decisions.
- The app works locally before deployment work begins.
- Authentication blocks all task access until login or sign up is complete.
- Each user only sees their own tasks.
- Tasks create and edit without requiring refresh.
- Tasks always stay sorted by nearest deadline first.
- Frontend styling is checked against the intended design guidelines throughout implementation.
- Main user flows are covered by Playwright CLI validation during development.
- Every milestone is verified before moving on to the next one.
