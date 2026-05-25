<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

This project uses a highly structured AI-assisted engineering workflow.
The codebase is intentionally organized to help AI agents (Cursor AI) understand:
•	Product goals
•	Business logic
•	Architecture boundaries
•	UI conventions
•	Folder organization
•	Development standards
•	Reusable systems
•	Scalability requirements
Before writing or refactoring any code, AI agents MUST read the project context files.
 
Application Building Context
Read the following files IN ORDER before implementing features, refactoring systems, or making architectural decisions:
1. `context/Project-Overview.md`
Purpose:
•	Product definition
•	Marketplace goals
•	Core features
•	User flows
•	Business logic
•	Authentication flow
•	Platform scope
This file explains WHAT the platform is.
 
2. `context/Architecture-Context.md`
Purpose:
•	System architecture
•	Folder structure
•	Feature boundaries
•	Route organization
•	Data flow
•	Server architecture
•	Scalability approach
This file explains HOW the platform is structured.
 
3. `context/UI-Context.md`
Purpose:
•	Design system
•	Theme rules
•	Typography
•	Layout philosophy
•	Component behavior
•	UI consistency
•	Responsive behavior
This file explains HOW the platform should visually feel.
 
4. `context/Code-Standards.md`
Purpose:
•	Code conventions
•	Naming standards
•	Component rules
•	Validation standards
•	Security standards
•	Refactoring rules
•	Performance rules
This file explains HOW code must be written.
 
5. `context/AI-Workflow.md`
Purpose:
•	AI development workflow
•	Implementation rules
•	Refactoring behavior
•	Architectural discipline
•	Separation of concerns
•	Reusable engineering patterns
This file explains HOW AI agents should operate inside the project.
 
6. `context/Project-Process-Tracker.md`
Purpose:
•	Current project phase
•	Completed systems
•	In-progress work
•	Pending work
•	Architecture changes
•	Development progress tracking
    must be update always. 
This file explains CURRENT project state.
 
Mandatory AI Development Rules
Always Read Context First
Before writing code:
1.	Read all required context files
2.	Understand the existing architecture
3.	Understand reusable systems
4.	Check existing components
5.	Check feature boundaries
6.	Avoid architectural conflicts
Never generate code blindly.
 
Core Engineering Philosophy
The codebase must remain:
•	Clean
•	Scalable
•	Reusable
•	Maintainable
•	Type-safe
•	Production-ready
The application should feel like:
•	Premium SaaS
•	Modern marketplace platform
•	Investor-level product
•	Long-term scalable system
 
Critical Architecture Rules
1. Never Duplicate Logic
Before creating:
•	Components
•	Hooks
•	Services
•	Utilities
•	Validators
Always check whether reusable versions already exist.
 
2. Keep Routes Thin
App Router pages should mainly:
•	Compose layouts
•	Fetch data
•	Render feature views
Avoid large business logic inside route files.
 
3. Separate Concerns Properly
UI Layer
Responsible for:
•	Rendering
•	Styling
•	Animations
•	Layouts
Business Logic Layer
Responsible for:
•	State handling
•	Validation
•	User workflows
•	Domain logic
Server Layer
Responsible for:
•	Database operations
•	Authentication
•	Authorization
•	API security
•	External integrations
 
4. Feature Isolation
Features must remain modular.
Avoid tight coupling between unrelated features.
Preferred feature structure:
features/
└── feature-name/
    ├── actions/
    ├── components/
    ├── hooks/
    ├── services/
    ├── validators/
    ├── types/
    └── utils/
 
5. Shared UI System
Reusable UI components belong inside:
components/ui
Shared application-level components belong inside:
components/shared
 
Development Workflow Rules
Before Implementing Features
AI agents must:
1.	Understand feature scope
2.	Check architecture boundaries
3.	Identify reusable systems
4.	Reuse existing patterns
5.	Follow UI conventions
6.	Follow naming standards
 
While Implementing Features
AI agents should:
•	Keep components small
•	Keep code readable
•	Extract reusable logic
•	Maintain strong typing
•	Keep consistent styling
•	Use scalable architecture
 
After Implementing Features
AI agents should:
•	Refactor duplicated logic
•	Improve readability
•	Optimize performance
•	Maintain consistency
•	Update progress tracker
 
UI & Styling Rules
Use:
•	Tailwind CSS
•	shadcn/ui
•	Framer Motion carefully
•	Consistent spacing
•	Reusable UI variants
Avoid:
•	Inline styles
•	Inconsistent spacing
•	Random colors
•	Over-engineered animations
 
Performance Rules
Always prioritize:
•	Server Components
•	SEO optimization
•	Dynamic imports
•	Lazy loading
•	Optimized images
•	Efficient rendering
 
Security Rules
Always implement:
•	Zod validation
•	Authorization checks
•	Protected routes
•	Input sanitization
•	Secure server actions
Never trust client-side data.
 
Cursor AI Expectations
Cursor AI should behave like:
•	A senior software engineer
•	A scalable systems architect
•	A maintainable codebase engineer
•	A refactoring specialist
•	A production-focused developer
Not like a rapid prototype generator.
 
Progress Tracking Rule
After every meaningful implementation:
Update:
context/Project-Process-Tracker.md
Track:
•	Completed systems
•	Current work
•	Pending work
•	Refactors
•	Architecture decisions
 
Final Goal
Every implementation should improve:
•	Scalability
•	Readability
•	Maintainability
•	Reusability
•	Performance
•	Professional product quality
The final platform should feel:
•	Premium
•	Modern
•	Trustworthy
•	Clean
•	Professional
•	Enterprise-ready







