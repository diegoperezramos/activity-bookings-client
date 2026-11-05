# Review Bookings Specification
- **Type**: feat
- **Status**: Draft

## Problem Description

Authenticated users need to review their bookings and the payment status reported by the API. The client does not yet specify this workflow.

### User Stories

- As an authenticated user, I want to view my bookings so that I can review my reservations.
- As an authenticated user, I want to see each booking's payment status as reported by the API so that I know its current status.

## Solution Overview

### User/App interface

Provide a booking review view for authenticated users. Require authentication before accessing it.

### Model and logic

Present the returned bookings and their reported payment statuses without deriving or changing status values.

### Data and API interactions

Use the authenticated user's JWT to call the JWT-protected `GET /bookings` endpoint. Display the bookings returned by the API without applying undocumented sorting or filtering. Do not rely on response fields beyond the booking and payment status described in the project brief.

## Acceptance Criteria

- [ ] WHILE the user is authenticated WHEN they open the booking review THE Activity Bookings Client SHALL request `GET /bookings` with the user's JWT.
- [ ] WHILE the user is not authenticated WHEN they open the booking review THE Activity Bookings Client SHALL require authentication before requesting `GET /bookings`.
- [ ] WHEN the API returns bookings THE Activity Bookings Client SHALL display each returned booking and its payment status as reported by the API.
- [ ] WHEN displaying returned bookings THE Activity Bookings Client SHALL NOT infer, relabel, or modify their reported payment statuses.
- [ ] WHEN displaying returned bookings THE Activity Bookings Client SHALL NOT apply undocumented sorting or filtering.
