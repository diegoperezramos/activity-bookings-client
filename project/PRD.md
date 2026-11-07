# Activity Bookings Client Product Requirements Document

A demo client for discovering activities, registering or logging in, making bookings, and reviewing booking payment status.

## Vision and Scope

The client supports learners and demo users exploring an activity-booking workflow against the external Activity Bookings API. It covers activity discovery and details, account access, participant bookings, and the user's booking and payment-status view. This is a training/demo client, not a production booking system.

The client may be a web or terminal application; the current repository manifest indicates a JavaScript React/Vite web client. API implementation and behavior beyond its published contract are out of scope.

## Functional Requirements

### FR1 Browse activities
- Users can discover scheduled activities and view each activity's name, date, duration, location, price, and participant limits.
- **Status**: Implemented

### FR2 Register and log in
- Users can register through `POST /users` with email, username, password, and `termsAccepted`, and log in through `POST /login` with email and password. Users then use the returned JWT for protected requests.
- **Status**: NotStarted

### FR3 Book participants
- Authenticated users can book one or more participants for an activity through the API.
- **Status**: NotStarted

### FR4 Review bookings
- Users can view their bookings and the payment status reported by the API.
- **Status**: NotStarted

## Technical Requirements

### TR1 Use the client application stack
- Implement the client in JavaScript with React and Vite, consistent with the repository's existing dependencies and scripts.
- **Status**: InProgress

### TR2 Integrate with the external API
- Use the Activity Bookings API as an external dependency and follow its published setup and endpoint contract; do not implement or assume undocumented backend behavior.
- **Status**: NotStarted
