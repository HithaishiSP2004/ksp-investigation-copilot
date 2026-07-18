# PROJECT_BLUEPRINT.md
# Karnataka State Police Datathon 2026
## AI Investigation Copilot
### Product Blueprint

Version: 1.0

Status:
Approved Blueprint

This document defines the complete product vision, implementation boundaries, feature hierarchy, system modules, user experience, and sprint roadmap.

Every implementation must align with this blueprint.

---

# 1. PRODUCT OVERVIEW

Product Name

(To Be Finalized)

Working Name

AI Investigation Copilot

Mission

Assist police officers throughout the investigation lifecycle using explainable AI while remaining fully aligned with the Karnataka State Police Datathon Challenge 1 requirements.

---

# 2. PRODUCT GOALS

Primary Goals

✓ Solve Challenge 1

✓ Improve investigation efficiency

✓ Reduce manual effort

✓ Organize investigation knowledge

✓ Explain AI reasoning

✓ Generate investigation outputs

✓ Demonstrate Zoho Catalyst capabilities

Secondary Goals

✓ Production-quality architecture

✓ Modern UX

✓ Fast performance

✓ Kannada support

✓ Future scalability

---

# 3. TARGET USERS

Primary

Police Officers

Secondary

Senior Officers

Investigators

Future

Crime Branch

Cyber Cell

District Administration

---

# 4. USER JOURNEY

Officer

↓

Login

↓

Dashboard

↓

Open Investigation

↓

Upload FIR

↓

Upload Evidence

↓

AI Processing

↓

Entity Extraction

↓

Timeline

↓

Knowledge Graph

↓

Case Insights

↓

AI Copilot

↓

Reports

↓

Export

This is the primary story of the application.

---

# 5. PRODUCT MODULES

Core Modules

Authentication

Dashboard

Case Management

Evidence Management

AI Copilot

Knowledge Graph

Timeline

Reports

Settings

Every module should remain independent.

---

# 6. DASHBOARD

Purpose

Help officers immediately understand:

My Cases

Recent Activity

Pending Tasks

Recently Uploaded Evidence

Quick Actions

Avoid dashboard clutter.

---

# 7. CASE MANAGEMENT

Capabilities

Create Case

Open Case

Search Case

Archive Case

Assign Officer

Case Status

Case Metadata

Every investigation starts here.

---

# 8. EVIDENCE MANAGEMENT

Evidence Types

Documents

Images

PDF

Attachments

Capabilities

Upload

Preview

Categorize

Search

Tag

Version

AI Analysis

Evidence becomes the source of intelligence.

---

# 9. AI PIPELINE

Evidence Upload

↓

OCR

↓

Entity Extraction

↓

Relationship Detection

↓

Knowledge Graph

↓

Timeline

↓

Investigation Intelligence

↓

Report Generation

This pipeline is the heart of the application.

---

# 10. KNOWLEDGE GRAPH

Purpose

Show relationships between:

People

Vehicles

Locations

Phone Numbers

Documents

Evidence

Cases

Officers

The graph supports investigation reasoning.

---

# 11. TIMELINE

Purpose

Chronological reconstruction of events.

Timeline includes

Complaint

Evidence

Statements

Actions

Reports

AI Suggestions

Every event should be evidence-backed.

---

# 12. AI COPILOT

Capabilities

Summarize Case

Explain Evidence

Answer Investigation Questions

Suggest Leads

Generate Reports

Find Similar Cases

Explain Reasoning

Draft Investigation Notes

The Copilot assists.

It never replaces the officer.

---

# 13. REPORTS

Generate

Investigation Summary

Case Summary

Evidence Summary

Chargesheet Draft

Officer Notes

Reports should be exportable.

---

# 14. SEARCH

Global Search

Support

Case ID

FIR Number

Person

Vehicle

Phone

Station

Evidence

Fast retrieval is essential.

---

# 15. SETTINGS

Language

Theme

Notifications

Profile

Accessibility

Future expansion ready.

---

# 16. AI AGENTS

Evidence Intelligence

↓

Entity Extraction

↓

Relationship Engine

↓

Timeline Builder

↓

Investigation Copilot

↓

Legal Assistant

↓

Report Generator

Each agent owns one responsibility.

---

# 17. ZOHO CATALYST

Core Services

Authentication

Data Store

File Store

Functions

AI Services (where appropriate)

Deployment

Every major capability should map to Catalyst.

---

# 18. DATABASE

Foundation

Official FIR ER Diagram

Extensions only where required.

Never redesign investigation entities.

---

# 19. LOCALIZATION

Primary

English

Kannada

Architecture should support future languages.

---

# 20. DESIGN PHILOSOPHY

Modern

Professional

Minimal

Enterprise

Police-first

Avoid:

Flashy effects

Cyberpunk themes

Visual clutter

---

# 21. PERFORMANCE

Every interaction should feel instant.

Preferred

Streaming

Caching

Parallel Processing

Optimistic UI

Lazy Loading

Minimal Client JavaScript

---

# 22. SECURITY

Authentication

Authorization

Validation

Audit Logs

Secure File Handling

Least Privilege

Never expose sensitive information.

---

# 23. ACCESSIBILITY

Keyboard Navigation

Readable Contrast

Focus States

Screen Reader Support

Accessible Forms

---

# 24. MVP FEATURES

Must Have

Authentication

Dashboard

Case Management

Evidence Upload

OCR

Entity Extraction

Knowledge Graph

Timeline

AI Copilot

Reports

Catalyst Deployment

Everything else is secondary.

---

# 25. STRETCH FEATURES

Advanced Graph Analysis

Case Linking

Officer Collaboration

Smart Recommendations

Offline Support

Analytics

Only implement after MVP.

---

# 26. ROADMAP

Crime Analytics

Predictive Insights

Inter-District Intelligence

Advanced AI

Mobile Application

GIS Integration

Roadmap features do NOT belong in the hackathon MVP.

---

# 27. SPRINT ROADMAP

Sprint 0

Repository

Knowledge Base

Catalyst Setup

Architecture

Sprint 1

Authentication

Dashboard

Case Management

Sprint 2

Evidence Upload

Storage

OCR

Sprint 3

Entity Extraction

Timeline

Knowledge Graph

Sprint 4

AI Copilot

Investigation Workspace

Sprint 5

Reports

Polish

Localization

Sprint 6

Testing

Performance

Security

Sprint 7

Deployment

Demo

Submission

---

# 28. DEFINITION OF SUCCESS

The project succeeds if:

A police officer can:

Upload an FIR

↓

Upload Evidence

↓

Receive AI Insights

↓

Understand Relationships

↓

Follow Timeline

↓

Generate Reports

↓

Continue Investigation

without confusion.

---

# 29. DEMO FLOW

1.

Officer Login

↓

2.

Dashboard

↓

3.

Open Investigation

↓

4.

Upload FIR

↓

5.

Upload Evidence

↓

6.

AI Processing

↓

7.

Knowledge Graph

↓

8.

Timeline

↓

9.

AI Copilot

↓

10.

Generate Report

↓

11.

Export

One uninterrupted investigation story.

---

# 30. FINAL BLUEPRINT PRINCIPLE

This project is NOT built to showcase technology.

Technology exists to improve investigations.

Every module.

Every screen.

Every API.

Every AI response.

Every interaction.

Must help a police officer solve a case more effectively.

If it does not contribute to that mission,

it should not be part of the MVP.

---

# 31. REQUIREMENT TRACEABILITY MATRIX

Every implementation MUST map back to the official challenge.

| Challenge Requirement | Product Module | Catalyst Service | Demo Moment | Priority |
|-----------------------|----------------|------------------|-------------|----------|
| Requirement 1 | Investigation Workspace | Data Store | Upload FIR | Critical |
| Requirement 2 | Evidence Management | File Store | Upload Evidence | Critical |
| Requirement 3 | AI Copilot | Catalyst Functions / AI | AI Analysis | Critical |
| Requirement 4 | Reports | Functions | Report Generation | High |

> Fill this table completely before Sprint 1 begins.

No feature should exist without a requirement.

---

# 32. CATALYST IMPLEMENTATION MATRIX

Every Catalyst service should have a purpose.

| Catalyst Service | Usage | Module |
|-----------------|-------|---------|
| Authentication | Officer Login | Authentication |
| Data Store | Investigation Data | Case Management |
| File Store | Evidence Storage | Evidence |
| Functions | AI Processing | AI Engine |
| Cache (if used) | Performance | Backend |
| Search (if used) | Fast Retrieval | Global Search |

This ensures Catalyst is used intentionally rather than superficially.

---

# 33. FEATURE PRIORITY MATRIX

## Critical (Must Exist)

- Authentication
- Dashboard
- Investigation Workspace
- Evidence Upload
- OCR
- Entity Extraction
- Timeline
- Knowledge Graph
- AI Copilot
- Reports
- Catalyst Deployment

---

## High Priority

- Search
- Report Export
- Localization
- Explainability
- Case History

---

## Medium Priority

- Notifications
- Officer Preferences
- Analytics

---

## Roadmap

Anything not directly improving the prototype.

---

# 34. DEMO CHECKPOINTS

Every sprint should improve the demo.

Sprint 1

✓ Login works

✓ Dashboard opens

Sprint 2

✓ Upload FIR

✓ Upload Evidence

Sprint 3

✓ OCR

✓ Entity Extraction

Sprint 4

✓ Timeline

✓ Graph

Sprint 5

✓ AI Copilot

Sprint 6

✓ Reports

Sprint 7

✓ Full Story Demo

If a sprint does not improve the demo,

reconsider the sprint.

---

# 35. BUILD CHECKLIST

Every feature must satisfy:

□ Solves challenge requirement

□ Uses Catalyst appropriately

□ Supports investigation workflow

□ Production-quality implementation

□ Error handling

□ Responsive UI

□ Accessible

□ English supported

□ Kannada supported

□ Tested

□ Demonstrable

No feature is complete until every box is checked.

---

# 36. DEFINITION OF MVP

The MVP is complete when an officer can:

Login

↓

Create/Open Case

↓

Upload FIR

↓

Upload Evidence

↓

AI extracts entities

↓

Timeline generated

↓

Knowledge Graph generated

↓

Ask Investigation Questions

↓

Generate Investigation Report

↓

Export

↓

Continue Investigation

without confusion.

Everything else is enhancement.

---

# 37. FINAL PRODUCT PRINCIPLE

The prototype should feel like software a police department could genuinely adopt—not a collection of disconnected hackathon features.

Every implementation decision should reinforce that experience.

END OF BLUEPRINT