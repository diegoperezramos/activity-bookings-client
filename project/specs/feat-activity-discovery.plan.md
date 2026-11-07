## Implementation Plan for feat-activity-discovery

### Step 1: Confirm the Activity API Contract
Before implementing response mapping, consult the authoritative API README and endpoint specifications from the API project. This workspace has no local API contract, so field names and list response shape must not be inferred.
- [x] Confirm the documented `GET /activities` response shape and the documented activity fields used for browsing.
- [x] Confirm the documented `GET /activities/:id` response shape and the exact fields corresponding to name, date, duration, location, price, and participant limits.
- [x] If the API documentation is unavailable, stop before coding response mappings and request the contract rather than inventing fields.

### Step 2: Add Activity API Access
Keep HTTP transport in the existing API wrapper and add only the activity-specific access needed by the UI.
- [x] Add activity request functions under `src/api/activities.js` that call `apiFetch` for `GET /activities` and `GET /activities/:id`.
- [x] Map the selected activity identifier into the documented detail route without adding authentication options or backend behavior.
- [x] Keep API-reported failures intact through the existing `apiFetch` error handling.

### Step 3: Implement Public Activity Browsing
Replace the current health-check placeholder in `src/App.jsx` with a public activity list and a way to select an activity.
- [x] Request the activity list when the browsing view opens and render returned activities using only fields confirmed by the API contract.
- [x] Represent loading, empty, and request-failure states in the existing application view; keep failure handling proportionate to the demo.
- [x] Make list and detail requests without a JWT and do not add registration, login, persistence, or backend changes.

### Step 4: Implement Activity Details
Load details on selection and present the information required by FR1.
- [x] Request `GET /activities/:id` for the selected activity rather than assuming list data is the complete detail record.
- [x] Render the documented values for name, date, duration, location, price, minimum participants, and maximum participants.
- [x] Provide a clear way to return to activity browsing and a visible loading or failure state while details are fetched.

### Step 5: Verify the FR1 Workflow
Use focused unit-level verification for the implemented API and documented detail-field mapping.
- [x] Verify public list/detail functions use the documented routes without an Authorization header.
- [x] Verify the detail-field mapping exposes all required values, including zero participant limits.
- [x] Add React Testing Library coverage for the user-facing browse/detail flow and request-failure state.
- [x] Run the complete unit-test suite and `npm run build`.