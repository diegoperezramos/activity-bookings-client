# Activity Bookings Client Product Requirements Document

A training/demo web client for activity discovery, account access, bookings, and booking review through the external Activity Bookings API.

## Vision and Scope

The client supports learners and demo users exploring an activity-booking workflow. The existing React/Vite application implements activity discovery and details, registration/login, participant booking, and booking review. This PRD adds one cohesive visual and navigation refactor: make authentication the entry point, then provide an authenticated main area for activities, details, booking, and booking review.

The proposed app-level authentication gate intentionally changes current behavior: activity browsing and details are currently public, while booking and booking review already require a token. The refactor changes the client experience only; preserve the existing public API endpoints and their request behavior. This remains a training/demo client, not a production booking system. API implementation and undocumented API behavior are out of scope.

## Functional Requirements

### FR1 Discover activities and details
- Users can view scheduled activities and each selected activity's name, date, duration, location, price, and participant limits.
- **Status**: Implemented

### FR2 Register and log in
- Registration sends `email`, `username`, `password`, and `terms: true` to `POST /users` when terms are accepted. Login sends `email` and `password` to `POST /login`.
- Successful registration and login responses include an `accessToken`; hold it in memory and supply it to protected requests. The provided API implementation confirms that registration authenticates the new user.
- **Status**: Implemented

### FR3 Book participants
- An authenticated user can submit a positive whole participant count for a selected activity through the API, and the client presents the API response without replacing its result.
- **Status**: Implemented

### FR4 Review bookings
- An authenticated user can review their bookings and the payment status reported by the API.
- **Status**: Implemented

### FR5 Provide a login-first authenticated application shell
- Before authentication, show the login entry point and registration as an alternative; do not expose the activity list or details.
- After confirmed authentication, provide one navigable main area containing the activity list, activity details and booking flow, and booking review.
- Keep navigation and shared visual treatment consistent across these views; preserve the implemented API-backed behavior.
- After successful login or registration, use the API-returned `accessToken` to enter the authenticated main area.
- **Status**: Implemented

## Acceptance Criteria

- On startup without an in-memory access token, the login entry point is primary, registration is available as an alternative, and activity and booking views are not rendered.
- After successful login or registration, the client stores the API-returned `accessToken` in memory and enters the authenticated main area with navigation to activities, activity details and booking, and booking review.
- Activity discovery, booking creation, and booking review continue using the existing endpoints and request behavior; no backend changes are required.
- Reloading the client returns to the unauthenticated entry point; no access token is persisted. Expiry handling, refresh, and logout are not added.

## Technical Requirements

### TR1 Preserve the existing client stack
- Continue using JavaScript, React, and Vite with the repository's existing dependencies and scripts.
- **Status**: Implemented

### TR2 Preserve the external API integration
- Keep the API external and preserve the existing endpoints: `GET /activities`, `GET /activities/:id`, `POST /users`, `POST /login`, `POST /bookings`, and authenticated `GET /bookings`. Do not change the backend or assume undocumented behavior.
- The existing client integrates activity discovery, account requests, booking creation, and booking review with these endpoints.
- **Status**: Implemented

### TR3 Keep authentication state in memory
- Continue holding the login access token in React memory and pass it to protected requests. Do not add token persistence, expiry handling, refresh, or logout behavior.
- **Status**: Implemented