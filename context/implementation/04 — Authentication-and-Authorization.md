# 04 — Authentication and Authorization
Read AGENTS.md before starting ..
Purpose
Build secure authentication, modal-based account creation, secure sessions, and role-based access control for the Novacity application.
Required Context
Read all context files before implementation, including AGENTS.md and the Novacity application specification.
Goal
Allow users, companies, and admins to securely access the platform while keeping account creation simple. Every new account must be created as a regular user. Company access is granted only by an admin after account creation.
Novacity — Authentication & Account Creation Refactor
1. Remove Account Type Selection
Refactor the Create Account UI and backend logic to completely remove account type selection during registration.
Delete:
•	Individual account option
•	Company account option
•	Any account type dropdown, radio group, tabs, or hidden inputs
•	Any related validation connected to account type
•	Any backend logic that accepts account type from signup input
•	Any database logic that sets company role during public signup
2. Default All New Accounts to User Role
Every newly created account must automatically be created with this default role:
role: "user"
Users must not be able to choose or submit their role during signup. Never trust role values from the client.
3. Company Role Management
Only admins can promote a user to a company account.
Admin should be able to change a user role from:
"user" -> "company"
When a user role becomes "company":
•	The user can post as a company
•	The company posting identity should use Novacity as the company posting context where applicable
•	The posting role should be handled as postingRole: "company"
•	Company posting requires a valid PassKey unless the business rules explicitly exempt admin accounts
4. Authentication UI Behavior
Refactor authentication UI so that Sign In and Create Account render as modals instead of separated standalone pages.
•	Sign In UI always opens in a modal
•	Create Account UI always opens in a modal
•	Forgot Password can remain available from the modal flow or route if needed
•	Remove or simplify separated auth pages if they only duplicate modal behavior
•	Keep the UX smooth, modern, and consistent across desktop and mobile
5. Signup Success Flow
After a user successfully creates an account, do not automatically redirect the user to the dashboard and do not automatically log the user in.
Instead:
•	Show a success notification, toast, or message
•	Keep the authentication modal open
•	Switch the modal to the Sign In form
•	Prefill or preserve the new email where appropriate
•	Let the user manually sign in using the new email and password
Example success message:
Account created successfully. Please sign in.
6. Error & Loading States
Improve UX during authentication requests.
While creating an account:
•	Show a loading spinner
•	Disable the submit button while the request is pending
•	Prevent double submission
•	Show a clear success or error notification
While signing in:
•	Show a loading spinner
•	Disable the submit button while the request is pending
•	Prevent double submission
•	Show a clear error message when login fails
7. Button UX Improvements
•	All clickable buttons should show cursor: pointer on hover
•	Disabled buttons should show proper disabled styling
•	Buttons should not allow duplicate requests while loading
•	Hover and focus states should be accessible and consistent
8. Code Cleanup
Clean and refactor authentication code.
•	Remove unused account type logic
•	Remove dead code
•	Simplify auth state management
•	Keep components modular and production-ready
•	Keep auth logic outside UI components
•	Follow clean Next.js App Router architecture
•	Use reusable modal components where possible
Features
Implement:
•	User sign up as default user role only
•	User sign in
•	Admin sign in
•	Secure sessions
•	Protected routes
•	Role-based access control
•	Admin-only company role promotion
•	Modal-based authentication UI
•	PassKey requirement for company posting where applicable
Routes
Create or keep only if needed for routing and modal entry points:
•	src/app/(auth)/sign-in/page.tsx — opens or renders Sign In modal flow
•	src/app/(auth)/sign-up/page.tsx — opens or renders Create Account modal flow
•	src/app/(auth)/forgot-password/page.tsx — optional password reset flow
If the application uses global auth modals, these pages should be thin route wrappers and should not duplicate business logic.
Feature Structure
Create:
•	src/features/auth/actions/
•	src/features/auth/components/
•	src/features/auth/validators/
•	src/features/auth/services/
•	src/features/auth/types/
•	src/features/auth/utils/
Components
Create or refactor:
•	src/features/auth/components/SignInForm.tsx
•	src/features/auth/components/SignUpForm.tsx
•	src/features/auth/components/ForgotPasswordForm.tsx
•	src/features/auth/components/AuthModal.tsx
•	src/features/auth/components/AuthPageView.tsx
Validation
Create:
src/features/auth/validators/authSchema.ts
Use:
•	Zod
•	React Hook Form
Validation must not accept role or accountType from public signup input.
Server Auth
Create:
•	src/server/auth/auth.ts
•	src/server/auth/session.ts
•	src/server/auth/password.ts
•	src/server/auth/permissions.ts
Roles
Support these roles internally:
•	user
•	admin
•	company
Important rule: public signup can only create role: "user". The company role must be assigned by an admin only.
Authorization Rules
•	Never trust client-side input
•	Always validate with Zod
•	Never allow the client to set role during signup
•	Protect dashboard routes
•	Protect admin routes
•	Protect company-only posting routes
•	Use secure password hashing
•	Keep auth logic outside UI components
•	Centralize role and permission checks in server auth utilities
•	Require valid PassKey for company posting where applicable
Completion Checklist
•	[x] Sign up works with default role: "user"
•	[x] Account type UI removed
•	[x] Account type backend logic removed
•	[x] Sign in works
•	[x] Auth modal opens correctly
•	[x] Signup success keeps user in auth modal and switches to sign in
•	[x] No automatic dashboard redirect after signup
•	[x] Loading spinner appears during sign up and sign in
•	[x] Buttons disable while loading
•	[x] Buttons show cursor pointer on hover
•	[x] Secure sessions work
•	[x] Role-based protection works
•	[x] Dashboard protected
•	[x] Admin protected
•	[x] Admin can promote user to company
•	[x] Company posting uses PassKey rules
•	[x] Validation added
•	[x] Dead code removed
Update Tracker
Mark when completed:
•	[x] Sign up
•	[x] Sign in
•	[x] Session management
•	[x] Protected routes
•	[x] Role-based authorization
•	[x] Account type removal
•	[x] Modal-based auth UI
•	[x] Admin-only company role promotion
•	[x] Signup success flow update
•	[x] Loading and button UX improvements
Next file
05-database-models-and-server-layer.md

