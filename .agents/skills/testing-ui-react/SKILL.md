---
name: testing-ui-react
description: "Writes React component and UI integration tests with Vitest and React Testing Library. Use for accessible user workflows and rendered behavior."
---

# React Component Testing with React Testing Library

Use this skill to test React components and UI behavior in the JavaScript client. Run tests with Vitest and render components with React Testing Library; verify what users can observe rather than component internals.

## Test Structure and Location

- Colocate tests with components, for example `ActivityCard.test.jsx` beside `ActivityCard.jsx`.
- Use `.test.jsx` for JSX tests and follow an existing local naming convention if one has already been established.
- Use `describe` and `it` blocks, keeping each test focused on one user-visible behavior.
- Follow arrange-act-assert: render the UI, interact with it, then assert the result.

## Testing User-Visible Behavior

- Query elements by accessible role and name first (`getByRole`, `getByLabelText`, `getByText`).
- Prefer `screen` queries; avoid asserting implementation details such as component state, private methods, or incidental CSS classes.
- Use `findBy...` for elements that appear asynchronously and `waitFor` only when an assertion needs to be retried.
- Use `fireEvent` for interactions with the dependencies currently listed by the project. If `@testing-library/user-event` is added, prefer it for realistic user interactions.
- Mock API or service boundaries so component tests remain deterministic and do not require a live server.

## Example

```jsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';

import BookingButton from './BookingButton';

afterEach(cleanup);

describe('BookingButton', () => {
  it('shows confirmation after the user books an activity', () => {
    render(<BookingButton />);

    fireEvent.click(screen.getByRole('button', { name: /book activity/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/booking confirmed/i);
  });
});
```

Replace the example component and expected behavior with the actual UI contract. The configured test scripts use jsdom; do not assume global test APIs or setup files are enabled.

## Running Tests

Use the configured npm scripts:

- **Run tests once:** `npm test`
- **Run one test file:** `npx vitest run --environment jsdom path/to/Component.test.jsx`
- **Watch during development:** `npm run test:dev`
- **Coverage:** `npm run test:coverage`

## Boundaries

- Keep component tests focused on rendered UI, user interactions, accessibility, and relevant loading/error states.
- Test business rules independently with the unit-testing skill.
- Do not use Playwright commands or assume a browser-level end-to-end setup; Playwright is not part of the current stack.
- Do not commit test files or implementation changes unless the user asks for a commit.

## Reference

See the [React Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro/) and [Vitest documentation](https://vitest.dev/).
