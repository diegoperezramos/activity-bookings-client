# Implementation Plan for feat-login-first-client-experience

### Step 1: Establish the Login-First Application Shell
Use the existing React application and in-memory `AuthContext`; do not add a router, persistence, or a new state-management dependency.
- [x] Render the account screen when `accessToken` is absent, and ensure activity and booking screens are not rendered in that state.
- [x] Render an authenticated main area when the context receives an API-returned token, with distinct activity list, activity detail, and booking review views and navigation between them.
- [x] Defer activity-list requests until the authenticated user opens the activity list; keep activity reads unauthenticated at the API boundary.
- [x] Preserve the reload behavior: a fresh application mount has no token and returns to the account screen.
- [x] Add shell tests for the unauthenticated gate, authenticated transition, navigation, and absence of persisted token state.

### Step 2: Make Login and Registration the Account Entry Point
Reuse `loginUser` and `registerUser` in `src/api/auth.js` and preserve their existing API payloads.
- [x] Present login as the primary account action and registration as a distinct alternative on the unauthenticated screen.
- [x] Keep the existing login fields and registration fields, required terms acceptance, and registration password minimum.
- [x] Show pending feedback and prevent duplicate submissions while either authentication request is in flight.
- [x] On either success, put the returned `accessToken` in `AuthContext` and enter the authenticated main area; on failure, show the reported authentication error and retain a way to correct input or retry.
- [x] Extend the authentication tests for login and registration pending, success, failure, token handoff, and entry into the authenticated shell.

### Step 3: Present Activity List and Detail as Separate Authenticated Screens
Keep the existing public activity API requests and the data already rendered by the client.
- [x] Request `GET /activities` when the authenticated user opens the list, without a JWT, and render loading, empty, loaded, and retryable error states.
- [x] Open a distinct detail view when an activity is selected and request `GET /activities/:id` without a JWT.
- [x] Render the returned activity details with loading and retryable error states, and provide a clear return to the activity list.
- [x] Keep navigation available across the authenticated screens without exposing those screens before authentication.
- [x] Update activity workflow tests to authenticate first and verify request timing, endpoint, absence of authorization headers, view transitions, and list/detail states.

### Step 4: Preserve Authenticated Booking Creation (FR3)
Retain the existing `createBooking` request and show the API result rather than interpreting booking rules in the client.
- [x] Keep booking controls within the selected activity detail screen and require an in-memory access token before enabling submission.
- [x] Accept only a positive whole participant count; submit the selected activity ID and count through `POST /bookings` with the current JWT.
- [x] Show pending feedback, prevent duplicate submissions, and provide a retry action after failure while retaining the selected activity and entered count.
- [x] Present success and failure payloads as reported by the API; do not infer capacity or payment outcomes or add client-side capacity checks.
- [x] Adapt booking tests to the authenticated shell and cover count validation, bearer authorization, pending behavior, unchanged API results/errors, and retry.

### Step 5: Integrate Authenticated Booking Review and Main Navigation
Continue using `getBookings` and preserve the existing response-order and payment-status behavior.
- [x] Request `GET /bookings` only when an authenticated user opens booking review, passing the in-memory JWT.
- [x] Render loading, empty, and retryable error states; display returned bookings in API response order with payment statuses unchanged.
- [x] Provide navigation from booking review back to activities and between the activity list, detail, and review screens.
- [x] Do not add sorting, capacity or payment inference, token persistence, expiry, refresh, logout, or backend behavior.
- [x] Update review tests to exercise the shell gate, authenticated request header, response order, literal statuses, states, retries, and navigation.

### Step 6: Verify Responsive, Accessible, and Existing Client Behavior
Use the repository's existing Vitest, React Testing Library, and Vite scripts; do not add dependencies for this refactor.
- [x] Adjust `src/App.css` for the separated account and authenticated screens while retaining the existing visual language and avoiding horizontal overflow or overlapping content.
- [ ] Verify semantic navigation and controls, meaningful labels, keyboard access, visible focus, sufficient contrast, and status communication that does not rely on color alone.
- [x] Run focused application tests while implementing, then run `npm test` and `npm run build`.
- [ ] Manually inspect the account, list, detail/booking, and review screens at 360x800 and 1280x800; check layout fit, navigation, loading/error feedback, and keyboard focus.
- [ ] If using the running API for a smoke check, limit it to non-mutating reads; do not create bookings or alter API-owned data as part of validation.

## Dependencies and Risks
- No new runtime or test dependencies are expected. The implementation depends on the existing React 19/Vite client, `AuthContext`, `apiFetch`, API modules, and Vitest/Testing Library setup.
- The current `App` loads activities on mount and displays account and discovery together. Tests that assume unauthenticated discovery will need to be updated to authenticate before exercising those workflows.
- The API contract is already represented by the existing client helpers/tests and the architecture document. Preserve registration's current `terms` payload and do not change the sibling API project or rely on undocumented behavior.
- Browser-only React state intentionally means reload returns to login. Do not interpret that as a reason to persist the token or add logout/expiry behavior.
- Responsive and accessibility criteria include manual viewport/keyboard checks beyond what the current jsdom tests can prove.

## Validation Strategy
- Add or update focused React Testing Library tests for each gate, view, request, state, retry, and navigation behavior, keeping existing API request contract tests intact.
- Run `npm test` for the full regression suite and `npm run build` for production compilation.
- Manually verify all primary views at the two specified viewport sizes and check keyboard focus and status/error announcements.
- Use only mocked API responses for booking submission tests. A live API smoke check is optional and must remain read-only; the API project and its data are out of scope.