---
name: testing-unit
description: "Writes and maintains JavaScript unit tests for business logic with Vitest. Use for services, utilities, validation, and bug regressions."
---

# Unit Testing with Vitest

Use this skill for isolated tests of services, utilities, validation, and other business logic in the JavaScript client. For React component behavior, use the React Testing Library skill.

## When to Write Unit Tests

- Add tests for new business logic and bug fixes.
- Cover meaningful edge cases, boundary conditions, and error paths.
- Run relevant tests before and after refactoring.

## File Naming and Location

- Colocate tests with the source file, for example `bookingService.test.js` beside `bookingService.js`.
- Use `.test.js` for JavaScript unit tests. Follow an existing local naming convention if one has already been established.
- Keep browser-level end-to-end tests separate; this project uses Vitest and React Testing Library for its current test stack.

## Test Structure

Use Vitest's `describe` and `it` blocks with an arrange-act-assert structure:

```javascript
import { describe, expect, it } from 'vitest';

describe('calculateTotal', () => {
  it('includes the number of guests in the total', () => {
    // Arrange
    const activity = { price: 20 };

    // Act
    const total = calculateTotal(activity, 2);

    // Assert
    expect(total).toBe(40);
  });
});
```

Keep tests focused on observable inputs and outputs. Group closely related assertions in one test when they describe the same behavior.

## Mocking Dependencies

Use `vi.fn()` for injected dependencies and external services. Configure only the behavior needed for the test, and restore or reset mocks between tests when necessary.

```javascript
import { beforeEach, describe, expect, it, vi } from 'vitest';

const bookingRepository = {
  findById: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
});

it('uses the repository to find a booking', async () => {
  bookingRepository.findById.mockResolvedValue({ id: 'booking-1' });

  const result = await getBooking(bookingRepository, 'booking-1');

  expect(result).toEqual({ id: 'booking-1' });
  expect(bookingRepository.findById).toHaveBeenCalledWith('booking-1');
});
```

Prefer dependency injection for isolated business logic. Mock network or browser boundaries rather than the function being tested.

## Running Tests

Run the configured npm scripts:

- **Run all unit tests once:** `npm run test:unit`
- **Run one test file:** `npx vitest run path/to/file.test.js`
- **Watch during development:** `npm run test:dev`
- **Coverage:** `npm run test:coverage`

## Coverage Guidance

- Cover business rules, meaningful branches, boundary values, and error behavior.
- Prioritize useful behavioral coverage over a numeric percentage target.
- Keep tests deterministic and independent; avoid real network or filesystem I/O.

## Common Vitest Matchers

```javascript
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeInstanceOf(Error);
expect(value).toBeUndefined();
expect(array).toHaveLength(3);
expect(() => fn()).toThrow();
expect(mockFn).toHaveBeenCalledWith(argument);
expect(mockFn).toHaveBeenCalledTimes(1);
```

For asynchronous code, await the result and use `resolves` or `rejects` when appropriate.

## Reference

See the [Vitest documentation](https://vitest.dev/) for asynchronous tests, mocking, configuration, and coverage.
