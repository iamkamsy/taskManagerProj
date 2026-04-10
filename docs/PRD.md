# Personal Task Manager Web App PRD

## 1. Product Overview

### Product Name
Personal Task Manager Web App

### Product Summary
A full-stack web application that requires account-based access before any task data is visible. Users land on an authentication screen, choose either log in or sign up, and only after successful authentication can they access their personal task manager. Each user can create, edit, view, and manage only their own tasks. The initial version focuses on a clean, responsive experience, correct database connectivity, automatic UI updates without refresh, and reliable local testing before cloud-readiness work begins.

### Core Product Vision
Build a secure and simple task manager that feels immediate and private: no anonymous access, no refresh-dependent workflows, and no exposure of one user's data to another.

## 2. Problem Statement

Users need a lightweight task manager that is secure, easy to use, and fast to update. Many basic apps fail to provide strong account-based privacy, while more advanced systems introduce unnecessary complexity. This product should solve the problem with a focused first release centered on secure login, personal task ownership, deadline-based ordering, and live updates.

## 3. First-Release Goals

- Require users to sign up or log in before they can access any task data.
- Ensure each authenticated user can access only their own tasks.
- Support adding tasks with exactly these fields in version one:
  - task name
  - task deadline
  - task description
- Automatically sort tasks by nearest deadline first and farthest deadline last.
- Allow users to edit all task fields from the interface.
- Ensure create and edit actions update the task list immediately without page refresh.
- Provide a logout action that returns the user to the authentication landing page.
- Build and validate the application locally first before preparing it for cloud hosting.

## 4. Non-Goals for First Release

- Team collaboration or shared tasks
- Advanced analytics dashboards in the first build
- Notifications and reminders
- Role-heavy admin workflows beyond basic secure ownership enforcement
- Production hosting work before local functionality is stable

## 5. Primary User Flow

1. User opens the web page.
2. User is prompted to either log in or sign up.
3. User cannot access the task manager without an account and successful authentication.
4. Once logged in, the user sees only their own tasks.
5. User adds a task with task name, task deadline, and task description.
6. Newly added tasks appear immediately without refresh.
7. Tasks are automatically sorted by closest deadline at the top and farthest deadline at the bottom.
8. User can click an edit button on a task.
9. User can edit all task fields.
10. Once editing is complete, the task list updates automatically and re-sorts without refresh.
11. User can log out.
12. Logout returns the user to the starting page that prompts log in or sign up.

## 6. Target User

An individual user who wants a private, account-based task manager for tracking personal tasks with deadlines and descriptions from both desktop and mobile devices.

## 7. User Stories

- As a visitor, I want to see a clear choice between log in and sign up so I know how to access the app.
- As a visitor, I want account creation to be required before task access so my data stays private.
- As an authenticated user, I want to see only my tasks so my information is protected.
- As an authenticated user, I want to add a task with a name, deadline, and description so I can organize upcoming work.
- As an authenticated user, I want tasks sorted automatically by nearest deadline so I can focus on what is due soonest.
- As an authenticated user, I want to edit any task field so I can keep my list accurate.
- As an authenticated user, I want updates to appear immediately without refreshing the page so the app feels responsive.
- As an authenticated user, I want to log out and return to the auth page so my account stays secure on shared devices.

## 8. Functional Requirements

### Authentication
- The landing page must present `Log In` and `Sign Up` options.
- Unauthenticated users must not be able to access the task dashboard.
- Users must be able to create an account and log in with their credentials.
- Users must be able to log out from the authenticated area.
- Logging out must clear the authenticated session and return the user to the auth landing page.

### Authorization and Privacy
- Every task must belong to exactly one authenticated user.
- The backend must enforce per-user data ownership on every task read and write operation.
- A user must never be able to view, edit, or delete another user's tasks.

### Task Creation
- Users must be able to create a task with:
  - task name
  - task deadline
  - task description
- All required fields must be validated before save.
- After successful creation, the new task must appear immediately in the UI without refresh.

### Task Viewing and Sorting
- Authenticated users must see a list of their tasks after login.
- Tasks must be sorted automatically by deadline in ascending order:
  - closest deadline at the top
  - farthest deadline at the bottom
- Sorting must happen on initial load and after any create or edit action.

### Task Editing
- Each task must include an edit action.
- The edit flow must allow modification of all existing task fields.
- After saving edits, the task list must update automatically without refresh.
- After saving edits, the list must automatically re-sort based on the updated deadlines.

### Frontend Behavior
- The app must behave like a responsive single-page experience for core flows.
- Create and edit operations must update visible task data immediately after success.
- The interface should work cleanly on mobile and desktop screens.
- The app should clearly display loading, validation, and error states.

### Backend and Database
- Flask must expose authenticated endpoints for sign up, log in, log out, task list, task creation, and task editing.
- MongoDB Atlas must persist users and tasks.
- Local development must verify that frontend, backend, and database connectivity all work together before cloud deployment preparation begins.

## 9. Non-Functional Requirements

- Standard task operations should feel responsive and complete in under 2 seconds under normal local and light hosted usage.
- The application should be secure by default, including password hashing and protected routes.
- The UI should remain usable on common mobile viewport sizes.
- The app should support local development and testing as the first milestone.
- Cloud hosting readiness should only be addressed after local feature completeness and database connectivity are confirmed.

## 10. Technical Direction

### Intended Stack
- Frontend: React
- Backend: Python with Flask
- Database: MongoDB Atlas
- Optional later optimization layer: C++ service if needed for heavier computation
- Hosting target after local validation: AWS Free Tier

### Local-First Delivery Strategy
The project should be implemented and verified locally first. That includes:
- running the frontend locally
- running the Flask backend locally
- confirming database connectivity
- confirming authentication works
- confirming task creation and editing work without refresh
- confirming per-user isolation works correctly

Only after those are stable should the project be adjusted for cloud hosting readiness.

## 11. Success Criteria for Version One

- A new visitor is forced into either sign up or log in before seeing any tasks.
- A logged-in user can create a task with name, deadline, and description.
- A logged-in user sees tasks immediately after creation with no refresh required.
- Tasks are always ordered from nearest deadline to farthest deadline.
- A logged-in user can edit all task fields.
- Edited tasks update and re-sort automatically with no refresh required.
- A logged-in user can log out and is returned to the auth landing page.
- Users cannot access each other's tasks.
- The full stack works locally against the database before cloud-hosting work starts.

## 12. Risks and Mitigations

- Auth implementation errors could expose protected routes.
  - Mitigation: enforce backend route protection and test unauthenticated access explicitly.
- Data ownership bugs could leak tasks across accounts.
  - Mitigation: filter every task query by authenticated user ID and test with multiple accounts.
- Frontend state bugs could require refresh to show changes.
  - Mitigation: update local state immediately after successful API responses and test create/edit flows manually.
- Cloud deployment work could start too early and slow down core development.
  - Mitigation: treat local validation as a hard gate before deployment preparation.

## 13. Open Decisions Claude Should Confirm With the User

Claude should not silently choose major architecture or product decisions when the tradeoffs are meaningful. It should pause and ask the user before proceeding on topics such as:

- authentication method
- exact login and signup fields
- session handling approach
- task edit UX style
- whether delete is included in version one
- frontend styling approach
- backend project structure
- how cloud deployment should be staged after local completion

## 14. Acceptance Criteria

- Unauthenticated users who open the site are shown a page with `Log In` and `Sign Up`.
- Unauthenticated users cannot reach the task manager page directly.
- Authenticated users can access only their own tasks.
- Users can create tasks with task name, task deadline, and task description.
- New tasks appear without refresh.
- Tasks are sorted by nearest deadline first and farthest deadline last.
- Each task has an edit button.
- Editing can change all task fields.
- Saved edits update the visible list and re-sort it automatically without refresh.
- The logout button ends the session and returns the user to the auth landing page.
- The app is tested locally with confirmed database connectivity before cloud-hosting preparation begins.
