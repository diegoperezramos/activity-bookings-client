## Implementation Plan for feat-user-authentication

### Step 1: Confirm the Authentication Contract
The API registration validator requires `terms`, as selected for this client after identifying a mismatch with the published README's `termsAccepted` field.
- [x] Confirm the client registration field as `terms` and login fields as `email` and `password`.
- [x] Confirm successful registration and login return an `accessToken`, and protected requests use `Authorization: Bearer <token>`.

### Step 2: Add Authentication API Requests
Use the existing API wrapper and keep endpoint calls isolated from the React view.
- [x] Add registration and login request functions in `src/api/auth.js`, calling `POST /users` and `POST /login` through `apiFetch`.
- [x] Send JSON request bodies with only the confirmed fields; do not couple the client to undocumented API error bodies.
- [x] Return the parsed API response unchanged so the caller can read its documented `accessToken` field.
- [x] Add focused unit tests for each route, method, request body, and returned response.

### Step 3: Implement Registration and Login Forms
Extend the existing application without replacing or regressing FR1 activity discovery.
- [x] Add registration inputs for email, username, password, and terms acceptance, plus login inputs for email and password.
- [x] Connect each form to its corresponding authentication request and represent the request-in-progress state to prevent duplicate submission.
- [x] Make the successful response's `accessToken` available to authenticated API consumers through application state; do not add persistent storage or lifecycle behavior.
- [x] Show proportionate success and generic request-failure feedback without assuming undocumented validation or authentication error shapes.

### Step 4: Use the JWT for Protected Requests
Reuse the bearer-token support already provided by `apiFetch` rather than adding another HTTP or authentication layer.
- [x] Pass the returned `accessToken` as the existing `jwt` option when making protected API requests.
- [x] Keep public activity requests unchanged and unauthenticated.
- [x] Do not implement booking endpoints, token persistence, expiry, refresh, or logout as part of this feature.

### Step 5: Verify the Authentication Workflow
Use existing Vitest and React Testing Library conventions to verify both API calls and user-visible behavior.
- [x] Test registration and login submissions for their exact endpoint and payload fields.
- [x] Test that successful authentication exposes the response `accessToken` for protected calls and that `apiFetch` sends it as `Authorization: Bearer <token>`.
- [x] Test the required registration terms control, request-pending state, and generic failure handling without asserting undocumented error details.
- [x] Run `npm test` and `npm run build`, confirming existing activity discovery tests continue to pass.