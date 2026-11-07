# Programación Inteligente
Documentación para el curso de programación inteligente

Domina las nuevas primitivas de programación con IA para desarrollos más productivos y de calidad; 
Pasa del Vibe Coding a la Spec-Driven Development.

---

## Sample project : Activity Bookings API
API de reservas de actividades implementada en TypeScript y Express.

- **Ejemplo de proyecto**: [activity-bookings-express](https://github.com/Programacion-Inteligente/activity-bookings-express)
- **Problema de autenticación corregido**: el registro y el login creaban instancias distintas de `UserService`. Cada instancia guardaba su propio índice de emails al arrancar, antes de que `loadAllData()` cargara los usuarios. Por eso, el usuario recién registrado quedaba guardado en el repositorio pero la instancia de login no lo encontraba y respondía `401`. El contador de IDs también podía quedar desactualizado y reutilizar un ID existente.
- **Solución aplicada**: `UserService` consulta el repositorio compartido para buscar usuarios y comprobar emails duplicados, y obtiene los nuevos IDs de la secuencia del repositorio, que se actualiza al cargar los datos. Así, el login encuentra al usuario recién registrado y no se sobrescriben registros existentes. Una prueba de regresión verifica el orden de carga y el uso de instancias separadas.

---

## Exercise project : Activity Bookings Client
Aplicación cliente para interactuar con la API de Activity Bookings.
En cualquier lenguaje/framework de elección (e.g., React, Vue, Angular, o una CLI en Python/Node.js). 
Incluso una aplicación de consola o web en Java o C#.

- [Briefing del proyecto cliente](./activitybookings-cli.briefing.md)

Por supuesto, puedes desarrollarlo con cualquier herramienta de IA que te guste.
- VSCode + GitHub Copilot
- Cursor
- ClaudeCode
- Antigravity
- etc.

### Current client implementation

This repository implements public activity discovery and account registration/login. Users can
browse scheduled activities and open details including date, duration, location, price, and
participant limits. Registration sends `email`, `username`, `password`, and the selected `terms`
value; login sends `email` and `password`. The API-returned `accessToken` is held in memory and
passed to `apiFetch` as `jwt` for protected requests. Booking and booking review remain planned.

The API registration validator expects `terms`, although the published API README currently names
the field `termsAccepted`; this client follows the validator. The client does not persist the token
or implement token expiry, refresh, logout, or booking requests.

Run the Activity Bookings API separately, then start the client from this repository:

```sh
npm install
npm run dev
```

The API URL defaults to `http://localhost:3000`; set `VITE_API_URL` in `.env` to override it.
Run `npm test` for tests and `npm run build` for a production build.

---

- **Author**: [Alberto Basalo](https://albertobasalo.dev)
- **Ai Code Academy en Español**: [AI code Academy](https://aicode.academy)
- **Socials**:
  - [X](https://x.com/albertobasalo)
  - [LinkedIn](https://www.linkedin.com/in/albertobasalo/)
  - [GitHub](https://github.com/albertobasalo)

