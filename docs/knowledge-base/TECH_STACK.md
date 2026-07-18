# TECH_STACK.md
# Engineering Bill of Materials (EBOM)

> Version: 1.0
> Status: Approved
> Purpose: Defines the official technology stack for the Karnataka State Police Datathon 2026 project.
>
> Every AI assistant and contributor MUST consult this file before introducing new dependencies or architectural changes.
>
> Consistency is more valuable than constantly changing technologies.

---

# 1. ENGINEERING PRINCIPLES

The stack must prioritize:

✓ Performance

✓ Maintainability

✓ Scalability

✓ Simplicity

✓ Type Safety

✓ Accessibility

✓ Production Readiness

✓ Zoho Catalyst Compatibility

Never introduce technology simply because it is trending.

Every dependency must solve a real problem.

---

# 2. FRONTEND

Framework

• Next.js (Latest Stable)

Language

• TypeScript (Strict Mode)

Rendering

• React Server Components

Routing

• App Router

Server Communication

• Server Actions
• Route Handlers

Styling

• Tailwind CSS (Latest Stable)

Animation

• Motion (Framer Motion successor if applicable)
• Native CSS animations where sufficient

---

# 3. UI COMPONENT SYSTEM

Preferred Philosophy

Build a reusable internal design system.

Components should be composable.

Avoid copying complete UI templates.

Preferred Inspirations

• shadcn/ui (foundation only)
• Radix UI primitives
• Modern Enterprise Design Systems

Avoid:

Large UI kits with unnecessary dependencies.

---

# 4. ICONOGRAPHY

Approved Libraries

✓ Lucide

✓ HugeIcons

✓ Solar Icons

✓ Iconoir

✓ Phosphor

Avoid mixing multiple visual styles.

Use one primary icon family throughout the project.

---

# 5. TYPOGRAPHY

Modern.

Readable.

Professional.

High accessibility.

Avoid decorative fonts.

Typography should improve investigation readability.

---

# 6. STATE MANAGEMENT

Use the simplest solution possible.

Priority:

React State

↓

Context

↓

Zustand (if global state becomes necessary)

Avoid introducing Redux unless absolutely required.

---

# 7. FORMS

Preferred

React Hook Form

Validation

Zod

Shared validation between frontend and backend whenever possible.

---

# 8. TABLES

Use modern performant table solutions.

Support:

Sorting

Filtering

Pagination

Virtualization if necessary.

---

# 9. CHARTS

Only when they improve investigations.

Avoid dashboards full of charts.

Prefer simple visualizations.

Charts must answer a question.

Never decorate the interface.

---

# 10. KNOWLEDGE GRAPH

The graph is a reasoning tool.

Not decoration.

Requirements

Fast

Interactive

Readable

Scalable

Supports entity relationships.

Supports investigation workflow.

---

# 11. MAPS

Only if the problem statement requires geographical context.

Maps must support investigations.

Avoid unnecessary GIS complexity.

---

# 12. BACKEND

Runtime

Node.js Latest LTS

Language

TypeScript

Architecture

Feature Based

Modular

Stateless where practical

Avoid monolithic service files.

---

# 13. DATABASE

Primary Platform

Zoho Catalyst Data Store

Foundation

Official FIR ER Diagram

Never redesign existing investigation entities.

Only extend.

---

# 14. STORAGE

Primary

Zoho Catalyst File Store

Used for:

Evidence

Documents

Images

Generated Reports

Attachments

Avoid unnecessary external storage.

---

# 15. AUTHENTICATION

Primary

Zoho Catalyst Authentication

Support:

Secure Sessions

Role Based Access

Future extensibility

Never build custom authentication.

---

# 16. AI

Architecture

Multi-service

Separate responsibilities.

Examples

Evidence Intelligence

Entity Extraction

Investigation Copilot

Legal Assistant

Report Generation

Prompt Registry

Avoid giant AI services.

---

# 17. OCR

OCR should support:

English

Kannada

Scanned FIRs

Typed Documents

Future extensibility preferred.

---

# 18. SEARCH

Search should support:

Cases

FIR Numbers

People

Vehicles

Phone Numbers

Acts

Stations

Evidence

Fast retrieval is mandatory.

---

# 19. LOCALIZATION

Primary Languages

English

Kannada

Architecture must support additional languages.

Never hardcode strings.

---

# 20. API DESIGN

Consistent.

RESTful.

Typed.

Validated.

Documented.

Predictable.

---

# 21. VALIDATION

Standard

Zod

Validate:

Requests

Responses

Forms

AI Inputs

API Parameters

Never trust client input.

---

# 22. FILE PROCESSING

Supported

PDF

Images

Documents

Future extensibility preferred.

Files should pass through a secure processing pipeline.

---

# 23. REPORT GENERATION

Reports should support:

Investigation Summary

Case Summary

Chargesheet Draft

Evidence Summary

PDF generation should be production quality.

---

# 24. PERFORMANCE

Preferred Techniques

Server Components

Streaming

Caching

Lazy Loading

Dynamic Imports

Optimistic UI

Parallel Requests

Minimal Client JavaScript

Avoid unnecessary hydration.

---

# 25. ACCESSIBILITY

Keyboard Navigation

Readable Contrast

Screen Reader Support

Clear Focus States

Accessible Forms

Accessibility is mandatory.

---

# 26. SECURITY

Never expose:

API Keys

Secrets

Environment Variables

Internal IDs

Stack Traces

Validate every request.

Principle of Least Privilege.

---

# 27. TESTING

Unit Tests

Integration Tests

Component Tests

Manual QA

Demo Testing

Regression Testing

Testing begins from Sprint 1.

Not Sprint 10.

---

# 28. CODE QUALITY

Formatting

Prettier

Linting

ESLint

Type Safety

Strict TypeScript

No ignored errors.

Readable code over clever code.

---

# 29. FOLDER STRUCTURE

Organize by feature.

Never by file type.

Each feature owns:

Components

Hooks

Services

Types

Validation

Tests

Assets

---

# 30. DEPENDENCY POLICY

Before installing any dependency ask:

Does the platform already provide this?

Can existing code solve it?

Does this reduce complexity?

Does this improve maintainability?

Avoid dependency bloat.

---

# 31. DEPLOYMENT

Platform

Zoho Catalyst ONLY

Every implementation should remain deployment-ready.

Avoid introducing infrastructure incompatible with Catalyst.

---

# 32. LOGGING

Meaningful.

Structured.

Actionable.

Never noisy.

Never expose sensitive information.

Logs should help debugging.

---

# 33. MONITORING

Monitor:

Errors

Performance

Failures

AI Requests

Processing Time

Uploads

User Actions

Build observability into the application.

---

# 34. DOCUMENTATION

Documentation supports implementation.

Keep it:

Short

Current

Useful

Living

Avoid documentation drift.

---

# 35. FUTURE READINESS

Architecture should support future growth.

Implementation should remain focused on the hackathon MVP.

Design for tomorrow.

Build for today.

---

# FINAL APPROVED STACK

Frontend

✓ Next.js

✓ React

✓ TypeScript

✓ Tailwind CSS

UI

✓ Radix

✓ shadcn/ui

✓ Lucide

✓ HugeIcons

Forms

✓ React Hook Form

✓ Zod

State

✓ React State

✓ Zustand (only when needed)

Backend

✓ Zoho Catalyst

Storage

✓ Catalyst File Store

Database

✓ Catalyst Data Store

Authentication

✓ Catalyst Authentication

AI

✓ Modular Copilot Architecture

Localization

✓ English

✓ Kannada

Deployment

✓ Zoho Catalyst ONLY

Engineering Philosophy

✓ Production Quality

✓ Investigation First

✓ Police First

✓ AI Copilot

✓ Explainable AI

✓ Modern Enterprise Software
