# CODING_STANDARDS.md
# Engineering Standards & Best Practices

> Version: 1.0
> Applies To:
>
> - Human Contributors
> - Antigravity
> - Claude
> - Gemini
> - ChatGPT
> - Any future AI assistant

---

# 1. PURPOSE

This document defines the official engineering standards for the project.

The goal is consistency.

Readable code.

Maintainable code.

Production-quality code.

Hackathons end.

Software remains.

Always write code that future developers can understand.

---

# 2. ENGINEERING PHILOSOPHY

Good software is:

Simple

Readable

Predictable

Maintainable

Reusable

Testable

Scalable

Secure

Avoid clever code.

Prefer understandable code.

---

# 3. GENERAL PRINCIPLES

Every implementation should satisfy:

✓ Single Responsibility

✓ DRY (Don't Repeat Yourself)

✓ KISS (Keep It Simple)

✓ Composition over Inheritance

✓ Explicit over Implicit

✓ Separation of Concerns

✓ Production Quality

---

# 4. FILE SIZE

Avoid giant files.

Recommended:

Components

<300 lines

Pages

<400 lines

Hooks

<200 lines

Services

<250 lines

Utilities

Small and focused

If a file becomes difficult to navigate,

split it.

---

# 5. FUNCTION DESIGN

Functions should do ONE thing.

Bad

processCase()

Good

extractEntities()

validateEvidence()

buildTimeline()

generateSummary()

Small functions are easier to test.

---

# 6. COMPONENT DESIGN

Components should have one responsibility.

Avoid "God Components."

Break interfaces into reusable pieces.

Prefer composition.

Avoid duplication.

---

# 7. NAMING

Names should explain purpose.

Good

EvidenceCard

TimelineView

KnowledgeGraph

ReportGenerator

Bad

Component1

Utils2

HelperNew

TestPage

Never abbreviate unnecessarily.

---

# 8. FILE NAMING

Use consistent naming.

Components

PascalCase

EvidenceCard.tsx

Hooks

camelCase

useEvidence.ts

Utilities

camelCase

formatDate.ts

Constants

UPPER_CASE where appropriate

Types

PascalCase

Avoid inconsistent naming.

---

# 9. FOLDER ORGANIZATION

Always organize by feature.

Never dump unrelated code into:

components/

helpers/

misc/

utils/

Each feature owns:

Components

Hooks

Services

Validation

Types

Tests

Assets

---

# 10. IMPORTS

Import order:

1.

Framework

↓

2.

Libraries

↓

3.

Internal Modules

↓

4.

Components

↓

5.

Types

↓

6.

Styles

Maintain consistency.

---

# 11. TYPESCRIPT

Strict Mode.

No "any".

Prefer:

unknown

Generics

Discriminated unions

Interfaces where appropriate.

Strong typing prevents bugs.

---

# 12. REACT

Prefer:

Functional Components

Hooks

Server Components where appropriate

Avoid Class Components.

Avoid unnecessary client rendering.

---

# 13. SERVER COMPONENTS

Use Server Components by default.

Client Components only when necessary.

Examples:

Forms

Animations

Browser APIs

Interactive widgets

Everything else should remain server-rendered.

---

# 14. SERVER ACTIONS

Prefer Server Actions over unnecessary API routes.

Use Route Handlers only when appropriate.

Reduce network complexity.

---

# 15. STATE MANAGEMENT

Always ask:

Can React state solve this?

↓

Can Context solve this?

↓

Use Zustand only if global state is truly required.

Avoid unnecessary complexity.

---

# 16. VALIDATION

Never trust client input.

Validate:

Forms

Requests

Parameters

Files

AI prompts

Uploads

Everything.

Use Zod consistently.

---

# 17. ERROR HANDLING

Never ignore errors.

Every async operation should handle:

Loading

Success

Failure

Recovery

Provide useful messages.

Never expose internal errors.

---

# 18. LOGGING

Logs should answer:

What happened?

Why?

Where?

Avoid:

console.log("test")

Meaningless logs.

Use structured logging.

---

# 19. COMMENTS

Good code explains itself.

Use comments only when:

Business logic is complex.

Algorithm needs explanation.

External API behavior is unusual.

Avoid commenting obvious code.

---

# 20. PERFORMANCE

Avoid:

Repeated queries

Unnecessary renders

Large bundles

Blocking operations

Expensive loops

Prefer:

Memoization

Streaming

Lazy Loading

Caching

Parallel execution

---

# 21. ASYNC CODE

Always prefer:

async / await

Avoid callback nesting.

Handle failures.

Never leave unresolved promises.

---

# 22. AI CODE

AI logic must remain isolated.

Never scatter prompts throughout the project.

Create:

Prompt Registry

Prompt Templates

Prompt Utilities

Prompt Types

Maintain consistency.

---

# 23. DATABASE ACCESS

Never write SQL throughout the project.

Create repository/service layers.

Keep database access centralized.

---

# 24. SECURITY

Never expose:

Secrets

API Keys

Tokens

Sensitive IDs

Never bypass validation.

Never trust uploads.

Always sanitize inputs.

---

# 25. ACCESSIBILITY

Every feature should support:

Keyboard navigation

Visible focus

ARIA labels

Readable typography

Good color contrast

Accessibility is not optional.

---

# 26. LOCALIZATION

Never hardcode UI strings.

Prepare every feature for:

English

Kannada

Future language support.

---

# 27. TESTING

Every feature should be testable.

Before marking complete verify:

Happy path

Failure path

Edge cases

Loading

Accessibility

Localization

---

# 28. GIT

Small commits.

Meaningful messages.

Example

feat: add evidence upload workflow

fix: resolve OCR parsing issue

Avoid

final

latest

new

test

---

# 29. PULL REQUEST PHILOSOPHY

Every PR should answer:

What changed?

Why?

How was it tested?

Impact?

Risk?

---

# 30. UI CONSISTENCY

Never create one-off designs.

Reuse:

Cards

Buttons

Dialogs

Inputs

Tables

Navigation

Maintain visual consistency.

---

# 31. ANIMATIONS

Animations should support usability.

Not distract users.

Prefer:

Fast

Smooth

Purposeful

Avoid:

Long animations

Flashy transitions

Overuse

---

# 32. AI REVIEW

Before writing code ask:

Would a senior engineer approve this?

Can another developer understand it?

Can this scale?

Can this be maintained?

---

# 33. DEFINITION OF GOOD CODE

Good code is:

Easy to read.

Easy to modify.

Easy to test.

Easy to debug.

Easy to explain.

If future-you would hate maintaining it,

rewrite it.

---

# 34. FINAL RULE

Every line of code should improve:

The investigation workflow.

The police officer's experience.

The product quality.

The engineering quality.

The final demonstration.

If it does not,

do not write it.
