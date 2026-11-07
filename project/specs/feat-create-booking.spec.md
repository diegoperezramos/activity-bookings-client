# Create Activity Booking Specification
- **Type**: feat
- **Status**: Planned

## Problem Description

Authenticated users need to book one or more participants for a discovered activity. The client must submit the booking to the API and report its result without adding booking, capacity, or payment behavior that the API contract does not define.

### User Stories

- As an authenticated user, I want to book one or more participants for an activity so that I can reserve places for them.
- As a user submitting a booking, I want to see the API's result so that I know whether the booking was accepted.

## Solution Overview

### User/App interface

Allow an authenticated user to select an activity discovered in the client, provide one or more participants, and submit the booking. Present the result reported by the API without inventing error wording or response details.

### Model and logic

Require an activity selection and at least one participant before submission. Use the API's reported outcome for capacity validation and mock payment; the client adds no payment rules.

### Data and API interactions

Send `POST /bookings` with the selected `activityId`, the supplied `participants`, and the user's JWT. Activity discovery is required to select an activity, and user authentication is required for authorization. No backend changes are in scope.

## Acceptance Criteria

- [ ] WHEN an authenticated user submits a booking THE Activity Bookings Client SHALL send `POST /bookings` with the selected `activityId`, the supplied `participants`, and the user's JWT.
- [ ] THE Activity Bookings Client SHALL allow submission only when an activity is selected and at least one participant is supplied.
- [ ] WHEN the API returns a booking result THE Activity Bookings Client SHALL present that result without assuming undocumented response fields.
- [ ] WHEN the API reports a booking rejection or failure THE Activity Bookings Client SHALL present the reported result without inventing error wording.
- [ ] THE Activity Bookings Client SHALL rely on the API's result for capacity validation and mock payment and SHALL NOT add payment rules.
