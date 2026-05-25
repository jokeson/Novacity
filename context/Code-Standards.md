Novacity — Code Standards
General Standards
Code must always be:
•	Clean
•	Readable
•	Scalable
•	Typed
•	Reusable
•	Production-ready
 
TypeScript Rules
Always use:
•	Explicit types
•	Interfaces
•	Shared type definitions
Avoid:
•	any
•	weak typing
 
Component Rules
Good Components
•	Small
•	Reusable
•	Single responsibility
Avoid:
•	Massive components
•	Mixed business logic
•	Deep nesting
 
Naming Standards
Components
PascalCase:
PropertyCard.tsx
DashboardSidebar.tsx
Hooks
camelCase with use prefix:
usePropertyFilter.ts
Actions
Clear action names:
createPropertyAction.ts
updateListingStatusAction.ts
 
File Organization Rules
Keep related logic together.
Example:
features/properties/
├── components/
├── actions/
├── hooks/
├── validators/
└── types/
 
Styling Rules
Use:
•	Tailwind utilities
•	Reusable variants
•	Consistent spacing
•	Shared UI components
no row 

Avoid:
•	Inline CSS
•	Repeated UI styles
 
Validation Rules
All forms must use:
•	Zod
•	React Hook Form
 
API Rules
Always:
•	Validate input
•	Handle errors properly
•	Return typed responses
•	Secure protected actions
 
Database Rules
Schemas must include:
•	timestamps
•	indexes where needed
•	validation rules
Avoid unnecessary nesting.
 
Accessibility Rules
Always support:
•	Keyboard navigation
•	ARIA labels
•	Semantic HTML
•	Proper contrast
 
Routing UX
•	For deep or nested screens, follow product rules in implementation docs **07** (catalog/property), **08** (dashboard), and **10** (admin) for **Back** controls and exiting stacks safely (prefer stable parent routes; avoid history-only exits when inappropriate).
 
Performance Rules
Always prioritize:
•	Server Components
•	Optimized rendering
•	Lazy loading
•	Dynamic imports
 
Refactoring Rules
Continuously:
•	Remove duplication
•	Improve readability
•	Extract reusable systems
•	Simplify logic
 
Final Standard
Every code file should feel:
•	Professional
•	Minimal
•	Maintainable
•	Easy to scale

