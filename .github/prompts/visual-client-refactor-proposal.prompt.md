---
description: "Analyze and specify a professional visual and navigation refactor for the Activity Bookings Client."
agent: "Architect Orchestrator"
argument-hint: "Optionally provide additional visual references or constraints."
---
# Activity Bookings Client: Visual Refactor Proposal

## Role and objective

Treat this as a proposed brownfield product change for the existing Activity Bookings Client. Use the `Architect Orchestrator` workflow to analyze the proposal, refine the product requirements, design an architecture that fits the existing client, and draft the implementation specifications. This is planning and documentation work; do not implement the UI or change application code.

The proposal is to remodel the client into a clear, professional web experience with distinct screens and a normal authenticated user journey: users enter through account access, then use the application to discover activities, view activity details, make bookings, and review their bookings.

## Product context

- The repository is an existing JavaScript application using React 19 and Vite 8. Inspect the current code and its tests before making recommendations; do not treat it as a greenfield project.
- The client integrates with the external Activity Bookings API. The API owns persistence, booking-capacity validation, and mock payment behavior. Do not change the backend or assume undocumented endpoint behavior.
- Existing capabilities include registration and login, activity discovery and details, authenticated participant booking, and authenticated booking review with API-reported payment status.
- Login returns an `accessToken` held in React memory and passed to protected API requests. Do not propose token persistence, expiry, refresh, or other undocumented token lifecycle behavior.
- Follow `AGENTS.md`, `README.md`, `project/briefing.md`, `project/PRD.md`, and `project/ADD.md`, along with any relevant specifications and API documentation. Resolve discrepancies against the documented API contract and existing verified behavior.

## Proposed user experience

1. **Account access:** Make login the entry point for the normal application flow. Keep registration available as a distinct, clearly signposted alternative. After successful authentication, users enter the main application. Do not assume registration automatically authenticates a user unless the API contract confirms it.
2. **Activities:** Provide a dedicated activity-list view, with a clear way to open an individual activity.
3. **Activity details:** Provide a separate detail view showing the available activity information and a clear booking action for authenticated users.
4. **Bookings:** Provide a dedicated view for a user's bookings and the payment statuses returned by the API.
5. **Navigation and session flow:** Make it easy to understand where the user is, move between the main authenticated views, and get back from details to the list. Reflect the requested login-first flow in the client without changing the API's public activity endpoints. Specify what unauthenticated users can access and how protected views behave; identify any unresolved policy question rather than silently inventing backend behavior.

## Visual and interaction goals

- Give the client a polished, professional, cohesive visual identity appropriate for an activity-booking service.
- Establish clear information hierarchy, readable typography, consistent spacing and components, and deliberate page layouts.
- Make the experience responsive across common desktop and mobile viewport sizes.
- Include accessible semantics, keyboard operation, visible focus, sufficient contrast, and meaningful labels; do not convey status by color alone.
- Specify loading, empty, error, and success states for the relevant screens and actions, with useful recovery where supported by existing behavior.
- Prefer the project's existing dependencies and patterns. Do not prescribe a design library, add packages, or impose a brand palette without evidence or a justified requirement.

## Scope and constraints

- Focus on client-side screens, navigation, interaction, and visual design while preserving existing API-backed capabilities.
- Keep activity data, booking results, and payment status grounded in API responses. Do not invent extra fields, business rules, payment steps, or guarantees.
- Do not add or infer token persistence, refresh, expiry handling, logout semantics, backend changes, or unrelated features.
- Call out intentional behavior changes from the current client, especially if activity browsing becomes unavailable until sign-in.
- Distinguish confirmed requirements from design recommendations and open questions. Ask the user for clarification when a consequential choice cannot be resolved from the repository or API contract.

## Orchestration and deliverables

- Have the Analyst refine the existing PRD for this visual and navigation change, preserving already implemented capabilities and recording behavior changes and measurable acceptance criteria.
- Have the Architect inspect the actual application and propose the smallest architecture that supports the new screens and authenticated flow while respecting the current stack and API boundaries.
- Have the Product Owner draft a prioritized set of cohesive, independently implementable specifications. Include acceptance criteria for navigation, authentication gating, activity list and details, booking, booking review, responsive design, and accessibility where applicable; avoid splitting work into artificial tasks.
- Update the relevant existing project documents and specifications in place where appropriate; do not create duplicate or conflicting PRDs or architecture documents.
- Return the orchestrator's concise summary of files created or updated, key decisions, prioritized specification items, and unresolved questions or blockers. Do not begin implementation.
