Novacity — AI Workflow Guide
Purpose
This file explains how AI agents (Cursor AI) should operate inside the Novacity codebase.
The goal is to maintain:
•	Consistency
•	Scalability
•	Readability
•	Reusable architecture
•	Production-level code quality
 
AI Development Rules
Always Understand Context First
Before generating code:
1.	Read Project-Overview.md
2.	Read Architecture-Context.md
3.	Read UI-Context.md
4.	Read Code-Standards.md
5.	Read Project-Process-Tracker.md
AI should understand:
•	Business goals
•	Existing architecture
•	Design system
•	Folder structure
•	Feature boundaries
 


Important Engineering Principles
1. Never Create Duplicate Components
Before creating a component:
•	Check existing shared components
•	Reuse existing UI patterns
•	Extend reusable systems
 
2. Keep Routes Thin
Pages should mainly:
•	Fetch data
•	Handle layout composition
•	Delegate UI rendering to feature components
Avoid large business logic inside route files.
 
3. Separate Concerns Properly
UI Layer
Responsible for:
•	Rendering
•	Styling
•	Layouts
•	Interactions
Business Logic Layer
Responsible for:
•	Data handling
•	Validation
•	State management
•	Workflows
Server Layer
Responsible for:
•	Database operations
•	Authentication
•	API logic
•	Secure actions
 
Component Creation Rules
Reusable Components Go Inside
components/
Feature-Specific Components Go Inside
features/{feature-name}/components/
 
Data Validation Rules
All forms must use:
•	Zod
•	React Hook Form
Never trust client-side input.
 
Database Rules
•	Use clean schemas
•	Keep models scalable
•	Avoid deeply nested structures
•	Use references where appropriate
•	Add timestamps consistently
 
Styling Rules
Use:
•	Tailwind CSS
•	shadcn/ui
•	Consistent spacing
•	Consistent typography
•	Reusable UI variants
Avoid:
•	Inline styles
•	Random spacing values
•	Inconsistent colors
 
Animation Rules
Use Framer Motion only where meaningful.
Avoid excessive animation.
 
Naming Rules
Use clear names:
Good:
•	PropertyCard
•	PropertyGallery
•	DashboardSidebar
Bad:
•	Card2
•	TempComponent
•	MySection
 
Refactoring Rules
AI should continuously:
•	Simplify logic
•	Remove duplication
•	Improve readability
•	Extract reusable systems
•	Improve scalability
 
Performance Rules
Always prioritize:
•	Server rendering
•	Lazy loading
•	Dynamic imports
•	Optimized images
•	Efficient queries
 
Security Rules
Always implement:
•	Validation
•	Authorization
•	Sanitization
•	Protected routes
•	Secure server actions
Never expose sensitive logic to the client.
 


Final AI Goal
Every generated code should feel:
•	Clean
•	Scalable
•	Professional
•	Maintainable
•	Production-ready

