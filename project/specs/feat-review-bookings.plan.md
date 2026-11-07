# Implementation Plan for feat-review-bookings

### Step 1: Confirm the Booking Retrieval Contract and Scope
Use the API README, retrieval specification, route, service, and response type as the contract reference. Keep all implementation changes in the client.
- [x] Confirm `GET /bookings` requires JWT authentication and returns an array belonging to the authenticated user.
- [x] Confirm retrieval responses contain booking fields `id`, `activityId`, `userId`, `participants`, `createdAt`, optional `paymentId`, required `paymentStatus`, and nested activity information; render only `id`, `activityId`, `participants`, `createdAt`, and `paymentStatus` for this feature.
- [x] Preserve each returned `paymentStatus` literally and render the array in the order received; do not sort, filter, derive status, or display unrelated response fields.
- [x] Confirm the live API is reachable with `GET /health` (HTTP 200) and unauthenticated `GET /bookings` is rejected (HTTP 401); no authenticated response was requested during the safe live check.

### Step 2: Add Authenticated Booking Retrieval Access
Keep the request in the existing API layer and reuse bearer-token handling in `apiFetch`.
- [x] Add `getBookings({ jwt })` in `src/api/bookings.js` to call `GET /bookings` with the provided JWT and return the parsed response unchanged.
- [x] Add focused API tests for the route, GET method, bearer authorization, unchanged array response, and propagation of HTTP/API and network failures.

### Step 3: Add the Booking Review Entry and Authentication Gate
Integrate booking review into the existing application view without changing the existing login, registration, discovery, or booking flows.
- [x] Add a clear control to open the booking review view and a way to return to activity discovery.
- [x] When there is no in-memory access token, show that sign-in is required and do not call `GET /bookings`.
- [x] When authenticated, pass the current access token to `getBookings`; do not persist or otherwise extend token lifecycle behavior.

### Step 4: Render Booking Review States and Contract Fields
Present API results with simple loading, empty, and failure states consistent with existing activity and booking feedback.
- [x] Show a loading state while the list request is pending and an empty state for an empty returned array.
- [x] Render each returned booking in API response order using only `id`, `activityId`, `participants`, `createdAt`, and the literal `paymentStatus` value.
- [x] Show a neutral error for API or network failures and provide a retry action that repeats the authenticated request.
- [x] Do not infer, relabel, or modify payment status; do not add sorting, filtering, activity enrichment, or additional response-field assumptions.

### Step 5: Verify the FR4 Workflow
Use the existing Vitest and React Testing Library conventions.
- [x] Test authenticated request headers and unchanged response handling, including literal status values and response order.
- [x] Test that unauthenticated access requires sign-in without making a protected request.
- [x] Test loading, empty, API failure, network failure, and successful retry states in the booking review view.
- [x] Run focused API and application tests, then `npm test` and `npm run build` to confirm existing flows remain intact.