# User Authentication Specification
- **Type**: feat
- **Status**: Draft

## Problem Description

Users need to register or log in through the client before using protected API requests. The client must send the required credentials to the API and use the JWT returned by the API for protected requests.

### User Stories

- As a prospective user, I want to register with my account details and accept the terms so that I can access the client’s authenticated features.
- As a returning user, I want to log in with my email and password so that I can access the client’s authenticated features.
- As an authenticated user, I want the client to use the API-returned JWT for protected requests so that I can use protected API features.

## Solution Overview

### User/App interface

Provide registration and login forms for the required inputs.

### Model and logic

Submit the form data to the corresponding API endpoint and use the returned JWT for protected API requests.

### Data and API interactions

- Registration uses `POST /users` with `email`, `username`, `password`, and `termsAccepted`.
- Login uses `POST /login` with `email` and `password`.
- Use an API-returned JWT for protected API requests.
- Token persistence, expiry, refresh, and unspecified authentication errors are outside this specification.

## Acceptance Criteria

- [ ] WHEN a user submits registration THE Activity Bookings Client SHALL send `POST /users` with `email`, `username`, `password`, and `termsAccepted`.
- [ ] WHEN a user submits login THE Activity Bookings Client SHALL send `POST /login` with `email` and `password`.
- [ ] WHEN the API returns a JWT after registration or login THE Activity Bookings Client SHALL use that JWT for protected API requests.
