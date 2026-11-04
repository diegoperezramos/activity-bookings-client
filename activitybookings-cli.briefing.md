# Activity Bookings Client Briefing

> Exercise: Build a client application to interact with the Activity Bookings API.

A **frontend** app that consumes the [Activity Bookings API](https://github.com/Programacion-Inteligente/activity-bookings-express), a demo backend for booking scheduled activities.

The client should let users:

- Discover and view activities, including their name, date, duration, location, price, and participant limits.

- Register and log in with an email and password, then use the returned JWT to access protected endpoints.

- Book one or more participants for an activity. The API validates capacity and processes payment through a mock gateway.

- View the user's bookings and their payment status.

The API is available at `http://localhost:3000` when run locally. See its README for setup instructions and endpoint details. The client can be implemented as a web or terminal app in any language or framework (e.g., React, Vue, Angular, or a CLI tool in Python/Node.js). A Java or C# console or web app is also fine.

> [!WARNING]
> Activity Bookings is a fictional activity booking system for demonstration and training purposes.
> Its API uses JWT authentication, JSON-file persistence, and a mock payment gateway; it is not intended for production use.
