# Login-First Client Experience Specification
- **Type**: feat
- **Status**: Released

Automated tests and the production build pass. The specified viewport, keyboard-flow, and measured-contrast checks remain unverified.

## Problem Description

The account panel currently shares a page with public activity browsing, activity details are selected inline, and booking review is an alternate section. This makes the client experience lack a clear account entry point and a consistent authenticated area. The client needs a login-first experience that gates its activity and booking screens on authentication while preserving existing API behavior.

### User Stories

- As a visitor, I want to log in or choose registration from a distinct account screen so that I can enter the client before browsing activities.
- As an authenticated user, I want separate activity list, activity detail, and booking review screens with consistent navigation so that I can move between discovery and my bookings.
- As an authenticated user, I want to book participants and review the result and reported booking statuses so that I can understand what the API recorded.

## Solution Overview

### User/App interface

Provide a login-first account screen with registration as a distinct alternative. After successful login or registration, provide an authenticated main area with separate activity list, activity detail, and booking review screens. Include navigation between the main screens and a clear return from activity detail to the list. Keep the visual hierarchy consistent and professional without prescribing a design library, palette, font, or new dependency.

### Model and logic

Require a positive whole participant count before submitting a booking. Present booking and payment outcomes as reported by the API; do not infer capacity or payment rules. Keep the access token in memory only. Reloading the client returns to the account screen.

### Data and API interactions

Use the existing login and registration requests. Both successful responses provide a user and access token and enter the authenticated main area. Use `GET /activities` and `GET /activities/:id` without a JWT, including after authentication. Use `POST /bookings` and `GET /bookings` with the in-memory JWT. Do not add persistence, expiry, refresh, logout semantics, backend changes, or API behavior.

## Acceptance Criteria

- [x] WHEN no access token is held in memory THE Activity Bookings Client SHALL show the account screen with login as the entry point and registration as a distinct alternative, without exposing activity or booking screens.
- [x] WHILE login or registration is pending THE Activity Bookings Client SHALL show a loading state. WHEN login or registration succeeds THE Activity Bookings Client SHALL use the returned access token to enter the authenticated main area. WHEN either request fails THE Activity Bookings Client SHALL show the failure and allow the user to correct input or retry.
- [x] WHEN an authenticated user opens the activity list THE Activity Bookings Client SHALL request `GET /activities` without a JWT and provide visible loading, empty, and error states, with a retry path for a failed request.
- [x] WHEN an authenticated user selects an activity THE Activity Bookings Client SHALL request `GET /activities/:id` without a JWT and show a distinct detail screen with the returned activity data, loading and error states, and a retry path for a failed request. THE Activity Bookings Client SHALL provide a return path to the activity list.
- [x] WHEN an authenticated user submits a booking THE Activity Bookings Client SHALL accept only a positive whole participant count, submit the selected activity ID and count through authenticated `POST /bookings`, show a loading state while pending, present the API-reported result on success, and present the reported error with a retry path on failure without inventing capacity or payment outcomes.
- [x] WHEN an authenticated user opens booking review THE Activity Bookings Client SHALL request `GET /bookings` with the in-memory JWT and show returned bookings in API response order with payment statuses as reported, plus loading, empty, error, and retry states. THE Activity Bookings Client SHALL NOT infer capacity or payment rules.
- [x] WHEN the authenticated main area is shown THE Activity Bookings Client SHALL provide distinct activity list, activity detail, and booking review screens with navigation between them, and SHALL return to the account screen after a reload without restoring the access token.
- [ ] THE Activity Bookings Client SHALL present readable typography, consistent spacing, and a clear visual hierarchy across the account and authenticated screens; at 360x800 and 1280x800 viewports, primary content and navigation SHALL fit without horizontal scrolling or overlap.
- [ ] THE Activity Bookings Client SHALL use semantic controls and meaningful labels, support keyboard navigation with visible focus, provide sufficient contrast, and communicate statuses without relying on color alone.
