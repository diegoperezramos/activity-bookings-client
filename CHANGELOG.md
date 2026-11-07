# Changelog

## [0.3.1] - 2026-11-07

### Fixed
- Show API registration validation errors and enforce the API's minimum password length in the registration form.

## [0.3.0] - 2026-11-07

### Added
- Authenticated participant booking for a selected activity through `POST /bookings`.
- Booking submission and API-reported success or error feedback, with no client-side capacity or payment rules.

## [0.2.0] - 2026-11-07

### Added
- User registration using the API's `terms` field and login using email and password.
- In-memory handling of the API-returned `accessToken` for protected API requests through `apiFetch`.

## [0.1.0] - 2026-11-07

### Added
- Public browsing of scheduled activities through `GET /activities`.
- Activity details through `GET /activities/:id`, including date, duration, location, price, and participant limits.
- Loading, empty, error, and retry states for activity browsing and details.