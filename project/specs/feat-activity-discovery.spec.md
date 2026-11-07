# Activity Discovery Specification
- **Type**: feat
- **Status**: Released

## Problem Description

Demo users need a public way to discover scheduled activities and review the details needed to decide whether an activity interests them. This client feature uses the existing Activity Bookings API; it does not change the backend.

### User Stories

- As a demo user, I want to browse scheduled activities so that I can discover available options.
- As a demo user, I want to view an activity's details so that I can understand its schedule, location, price, and participant limits.

## Solution Overview

### User/App interface

Provide a public activity-browsing view with a way to open an individual activity's details. Show the activity name, date, duration, location, price, and participant limits.

### Model and logic

Present activity information returned by the API. Do not require registration or authentication for browsing or viewing details.

### Data and API interactions

Use `GET /activities` to retrieve activities and `GET /activities/:id` to retrieve a selected activity's details. No client-side persistence or backend changes are in scope.

## Acceptance Criteria

- [x] WHEN a user opens the activity-browsing view, THE Activity Bookings Client SHALL request `GET /activities`.
- [x] WHEN `GET /activities` returns activities, THE Activity Bookings Client SHALL present the returned activities for browsing.
- [x] WHEN a user selects an activity, THE Activity Bookings Client SHALL request `GET /activities/:id` for that activity.
- [x] WHEN `GET /activities/:id` returns an activity, THE Activity Bookings Client SHALL show its name, date, duration, location, price, and participant limits.
- [x] THE Activity Bookings Client SHALL allow users to browse activities and view activity details without registration or authentication.
- [x] THE Activity Bookings Client SHALL make no backend changes as part of this feature.
