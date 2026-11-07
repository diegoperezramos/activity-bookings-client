## Implementation Plan for feat-create-booking

### Step 1: Confirm the Booking Contract and Client Boundaries
Use the API README, booking endpoint specification, and current route/service behavior as the contract reference. Keep capacity validation and mock payment in the API.
- [x] Treat `participants` as a positive numeric count, as required by the API, rather than an array of participant records; send it as a JSON number.
- [x] Use the selected activity's existing `id` as `activityId` and the in-memory access token already exposed by `useAuth`.
- [x] Keep successful booking data API-owned and render only response fields established by the booking contract; do not infer client-side capacity or payment behavior.
- [x] Treat `{ message, errors }` as the API's error response shape; use the API-reported message/details rather than inventing booking rejection wording.

### Step 2: Add Authenticated Booking API Access
Isolate the request in the existing API layer and reuse bearer-token handling in `apiFetch`.
- [x] Add `createBooking` in `src/api/bookings.js` to send `POST /bookings` with JSON `{ activityId, participants }` and the provided JWT.
- [x] Return the parsed success response unchanged so the view can present the API result without client-side response mapping.
- [x] Preserve the parsed API error payload alongside the existing HTTP status when `apiFetch` rejects; keep the current generic message for callers that do not consume API details.
- [x] Add focused API tests for method, route, JSON headers/body, bearer authorization, unchanged success response, and retained API error payload.

### Step 3: Add Booking Inputs to the Selected Activity
Extend the existing activity-detail view without changing public discovery or authentication behavior.
- [x] Show the booking controls only when the selected activity details are loaded.
- [x] For authenticated users, provide a required numeric participant-count input with a minimum of 1 and a submit control.
- [x] For users without an access token, require sign-in before enabling or sending a booking request; do not call the protected endpoint unauthenticated.
- [x] Keep the selected activity identifier bound to the booking request and prevent submission when the activity or participant count is missing/invalid.

### Step 4: Present Submission and API Outcomes
Represent the booking request lifecycle in the selected activity view and prevent accidental duplicate submissions.
- [x] Track pending, success, and failure states; disable submission while pending and ignore repeated submits.
- [x] On success, present the booking returned by the API using only contract-supported values and without deriving a different payment status.
- [x] On an HTTP rejection, present the API-provided message and validation details when present; use a neutral fallback only when no API response is available, such as a network failure.
- [x] Do not add client-side capacity checks, payment rules, token persistence, expiry, refresh, or logout behavior.

### Step 5: Verify the FR3 Workflow
Use the repository's existing Vitest and React Testing Library conventions.
- [x] Test the booking API helper's exact JSON payload, bearer token, success response, and API error details.
- [x] Test that booking requires authentication, a selected activity, and a participant count of at least one, and that the count is sent as a number.
- [x] Test pending-state duplicate prevention and user-visible success and API-reported rejection/failure results.
- [x] Run the focused booking/API and application tests, then `npm test` and `npm run build` to confirm FR1/FR2 remain intact.