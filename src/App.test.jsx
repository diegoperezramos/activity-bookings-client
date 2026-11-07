import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL } from './config';
import { apiFetch } from './api/client';
import { AuthProvider, useAuth } from './auth-context';
import App, { getActivityDetailFields } from './App';

function jsonResponse(payload, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => payload };
}

function renderApp(children = <App />) {
  return render(<AuthProvider>{children}</AuthProvider>);
}

function renderAuthenticatedApp() {
  renderApp(<><App /><AuthTokenSetter /></>);
  fireEvent.click(screen.getByRole('button', { name: 'Set test token' }));
}

function AuthTokenProbe() {
  const { accessToken } = useAuth();
  return (
    <>
      <output aria-label="Available access token">{accessToken ?? 'none'}</output>
      <button type="button" onClick={() => apiFetch('/protected-resource', { jwt: accessToken })}>
        Load protected resource
      </button>
    </>
  );
}

function AuthTokenSetter() {
  const { setAccessToken } = useAuth();
  return (
    <button type="button" onClick={() => setAccessToken('test-token')}>
      Set test token
    </button>
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('getActivityDetailFields', () => {
  it('exposes all documented detail values including zero participant limits', () => {
    const activity = {
      date: '2026-11-07',
      duration: 90,
      location: 'Riverside Park',
      price: 25,
      minParticipants: 0,
      maxParticipants: 12,
    };

    expect(getActivityDetailFields(activity)).toEqual([
      { label: 'Date', value: '2026-11-07' },
      { label: 'Duration', value: 90 },
      { label: 'Location', value: 'Riverside Park' },
      { label: 'Price', value: 25 },
      { label: 'Minimum participants', value: 0 },
      { label: 'Maximum participants', value: 12 },
    ]);
  });
});

describe('activity discovery workflow', () => {
  const listedActivity = {
    id: 'activity-1',
    name: 'Riverside Kayaking',
    date: '2026-11-07',
    location: 'Riverside Park',
    price: 25,
  };

  const detailedActivity = {
    ...listedActivity,
    duration: 90,
    minParticipants: 2,
    maxParticipants: 12,
  };

  it('requests the public activity list when opened and renders returned activities', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([listedActivity]));
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Set test token' }));

    expect(await screen.findByRole('button', { name: /Riverside Kayaking/ })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/activities`,
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    expect(new Headers(fetchMock.mock.calls[0][1].headers).has('Authorization')).toBe(false);
  });

  it('shows a loading state while the public activity list is pending', async () => {
    let completeList;
    const listResponse = new Promise((resolve) => {
      completeList = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(listResponse);
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(screen.getByRole('button', { name: 'Set test token' }));

    expect(await screen.findByText('Loading activities...')).toBeInTheDocument();
    completeList(jsonResponse([listedActivity]));
    expect(await screen.findByRole('button', { name: /Riverside Kayaking/ })).toBeInTheDocument();
  });

  it('requests selected details publicly, displays required fields, and returns to the list', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([listedActivity]))
      .mockResolvedValueOnce(jsonResponse(detailedActivity));
    vi.stubGlobal('fetch', fetchMock);

    renderAuthenticatedApp();
    fireEvent.click(await screen.findByRole('button', { name: /Riverside Kayaking/ }));

    const detailRegion = await screen.findByRole('region', { name: 'Activity details' });
    expect(within(detailRegion).getByRole('heading', { name: 'Riverside Kayaking' })).toBeInTheDocument();
    for (const [label, value] of [
      ['Date', '2026-11-07'],
      ['Duration', '90'],
      ['Location', 'Riverside Park'],
      ['Price', '25'],
      ['Minimum participants', '2'],
      ['Maximum participants', '12'],
    ]) {
      expect(within(detailRegion).getByText(label)).toBeInTheDocument();
      expect(within(detailRegion).getByText(value)).toBeInTheDocument();
    }

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE_URL}/activities/activity-1`);
    expect(new Headers(fetchMock.mock.calls[1][1].headers).has('Authorization')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /All activities/ }));
    expect(await screen.findByRole('button', { name: /Riverside Kayaking/ })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Activity details' })).not.toBeInTheDocument();
  });

  it('shows a loading state while selected activity details are pending', async () => {
    let completeDetails;
    const detailResponse = new Promise((resolve) => {
      completeDetails = resolve;
    });
    const fetchMock = vi.fn((url) => (url.endsWith('/activities')
      ? Promise.resolve(jsonResponse([listedActivity]))
      : detailResponse));
    vi.stubGlobal('fetch', fetchMock);

    renderAuthenticatedApp();
    fireEvent.click(await screen.findByRole('button', { name: /Riverside Kayaking/ }));

    expect(await screen.findByText('Loading activity details...')).toBeInTheDocument();
    completeDetails(jsonResponse(detailedActivity));
    expect(await screen.findByRole('heading', { name: 'Riverside Kayaking' })).toBeInTheDocument();
  });

  it('shows a list request failure and retries successfully', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(null, { ok: false, status: 503 }))
      .mockResolvedValueOnce(jsonResponse([listedActivity]));
    vi.stubGlobal('fetch', fetchMock);

    renderAuthenticatedApp();

    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('button', { name: /Riverside Kayaking/ })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, options] of fetchMock.mock.calls) {
      expect(new Headers(options.headers).has('Authorization')).toBe(false);
    }
  });

  it('shows a detail request failure and retries successfully', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([listedActivity]))
      .mockResolvedValueOnce(jsonResponse(null, { ok: false, status: 503 }))
      .mockResolvedValueOnce(jsonResponse(detailedActivity));
    vi.stubGlobal('fetch', fetchMock);

    renderAuthenticatedApp();
    fireEvent.click(await screen.findByRole('button', { name: /Riverside Kayaking/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { name: 'Riverside Kayaking' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE_URL}/activities/activity-1`);
    expect(fetchMock.mock.calls[2][0]).toBe(`${API_BASE_URL}/activities/activity-1`);
    for (const [, options] of fetchMock.mock.calls) {
      expect(new Headers(options.headers).has('Authorization')).toBe(false);
    }
  });
});

describe('activity booking workflow', () => {
  const listedActivity = {
    id: 'activity-1',
    name: 'Riverside Kayaking',
    date: '2026-11-07',
    location: 'Riverside Park',
    price: 25,
  };

  const detailedActivity = {
    ...listedActivity,
    duration: 90,
    minParticipants: 2,
    maxParticipants: 12,
  };

  it('does not expose activity or booking screens before authentication', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([listedActivity]));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

    expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Activities' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
    expect(screen.queryByRole('form', { name: 'Book this activity' })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requires authentication and a positive whole participant count', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve(
      url.endsWith('/activities')
        ? jsonResponse([listedActivity])
        : jsonResponse(detailedActivity),
    ));
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(await screen.findByRole('button', { name: 'Set test token' }));
    fireEvent.click(await screen.findByRole('button', { name: /Riverside Kayaking/ }));

    const input = await screen.findByLabelText('Participants');
    const submit = screen.getByRole('button', { name: 'Book activity' });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('step', '1');
    expect(submit).toBeDisabled();

    fireEvent.change(input, { target: { value: '-1' } });
    expect(submit).toBeDisabled();
    fireEvent.change(input, { target: { value: '0' } });
    expect(submit).toBeDisabled();
    fireEvent.change(input, { target: { value: '1.5' } });
    expect(submit).toBeDisabled();
    fireEvent.change(input, { target: { value: '1' } });
    expect(submit).toBeEnabled();
  });

  it('does not send bookings from the unauthenticated account screen', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve(
      url.endsWith('/activities')
        ? jsonResponse([listedActivity])
        : jsonResponse(detailedActivity),
    ));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();
    expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('form', { name: 'Book this activity' })).not.toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([url]) => url.endsWith('/bookings'))).toBe(false);
  });

  it('submits above the activity maximum and presents the unchanged API result', async () => {
    let completeBooking;
    const bookingResponse = { id: 'booking-1', result: 'accepted', payment: { status: 'pending' } };
    const bookingPromise = new Promise((resolve) => {
      completeBooking = resolve;
    });
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/activities')) {
        return Promise.resolve(jsonResponse([listedActivity]));
      }
      if (url.endsWith('/activities/activity-1')) {
        return Promise.resolve(jsonResponse(detailedActivity));
      }
      return bookingPromise;
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(await screen.findByRole('button', { name: 'Set test token' }));
    fireEvent.click(await screen.findByRole('button', { name: /Riverside Kayaking/ }));
    fireEvent.change(await screen.findByLabelText('Participants'), { target: { value: '13' } });

    const submit = screen.getByRole('button', { name: 'Book activity' });
    fireEvent.click(submit);
    expect(await screen.findByText('Submitting booking...')).toBeInTheDocument();
    expect(submit).toBeDisabled();
    fireEvent.click(submit);

    const bookingRequests = fetchMock.mock.calls.filter(([url]) => url.endsWith('/bookings'));
    expect(bookingRequests).toHaveLength(1);
    const [bookingUrl, options] = bookingRequests[0];
    expect(bookingUrl).toBe(`${API_BASE_URL}/bookings`);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ activityId: 'activity-1', participants: 13 });
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer test-token');

    completeBooking(jsonResponse(bookingResponse));
    const result = await screen.findByRole('status', { name: 'Booking response' });
    expect(result.querySelector('pre').textContent).toBe(JSON.stringify(bookingResponse, null, 2));
  });

  it('presents the API-reported rejection and retries with the selected activity and count', async () => {
    const rejection = { message: 'Booking rejected', errors: ['Participants are unavailable'] };
    let bookingRequestCount = 0;
    const success = { id: 'booking-2', paymentStatus: 'pending' };
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/activities')) {
        return Promise.resolve(jsonResponse([listedActivity]));
      }
      if (url.endsWith('/activities/activity-1')) {
        return Promise.resolve(jsonResponse(detailedActivity));
      }
      bookingRequestCount += 1;
      return Promise.resolve(bookingRequestCount === 1
        ? jsonResponse(rejection, { ok: false, status: 409 })
        : jsonResponse(success));
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(await screen.findByRole('button', { name: 'Set test token' }));
    fireEvent.click(await screen.findByRole('button', { name: /Riverside Kayaking/ }));
    fireEvent.change(await screen.findByLabelText('Participants'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Book activity' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('"message": "Booking rejected"');
    expect(alert).toHaveTextContent('"errors": [');
    expect(alert).toHaveTextContent('Participants are unavailable');
    expect(alert).not.toHaveTextContent('Booking failed');

    const participants = screen.getByLabelText('Participants');
    expect(participants).toHaveValue(2);
    fireEvent.click(screen.getByRole('button', { name: 'Try booking again' }));

    const result = await screen.findByRole('status', { name: 'Booking response' });
    expect(result.querySelector('pre').textContent).toBe(JSON.stringify(success, null, 2));
    expect(participants).toHaveValue(2);
    expect(bookingRequestCount).toBe(2);
    const bookingRequests = fetchMock.mock.calls.filter(([url]) => url.endsWith('/bookings'));
    expect(bookingRequests).toHaveLength(2);
    for (const [, options] of bookingRequests) {
      expect(JSON.parse(options.body)).toEqual({ activityId: 'activity-1', participants: 2 });
      expect(new Headers(options.headers).get('Authorization')).toBe('Bearer test-token');
    }
  });

  it('shows neutral feedback when the booking request receives no API response', async () => {
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/activities')) {
        return Promise.resolve(jsonResponse([listedActivity]));
      }
      if (url.endsWith('/activities/activity-1')) {
        return Promise.resolve(jsonResponse(detailedActivity));
      }
      return Promise.reject(new TypeError('Failed to fetch'));
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(await screen.findByRole('button', { name: 'Set test token' }));
    fireEvent.click(await screen.findByRole('button', { name: /Riverside Kayaking/ }));
    fireEvent.change(await screen.findByLabelText('Participants'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Book activity' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No API response was received.');
    expect(alert).not.toHaveTextContent('Booking failed');
  });
});

describe('booking review workflow', () => {
  function bookingsResponse(bookings, options) {
    return jsonResponse(bookings, options);
  }

  it('requires sign-in without requesting bookings when opened unauthenticated', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

    expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([url]) => url.endsWith('/bookings'))).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows loading, then renders only verified fields in API order with literal statuses', async () => {
    let completeBookings;
    const response = [
      {
        id: 'booking-2',
        activityId: 'activity-2',
        userId: 'private-user-2',
        participants: 3,
        createdAt: '2026-11-06T09:00:00.000Z',
        paymentId: 'payment-2',
        paymentStatus: 'Awaiting-CAPTURE',
        activity: { name: 'Hidden activity name' },
      },
      {
        id: 'booking-1',
        activityId: 'activity-1',
        userId: 'private-user-1',
        participants: 1,
        createdAt: '2026-11-05T09:00:00.000Z',
        paymentStatus: 'settled_by_api',
      },
    ];
    const pendingResponse = new Promise((resolve) => {
      completeBookings = resolve;
    });
    const fetchMock = vi.fn((url) => (
      url.endsWith('/activities')
        ? Promise.resolve(jsonResponse([]))
        : pendingResponse
    ));
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(screen.getByRole('button', { name: 'Set test token' }));
    fireEvent.click(screen.getByRole('button', { name: 'Review bookings' }));

    expect(await screen.findByText('Loading bookings...')).toBeInTheDocument();
    const [bookingsUrl, options] = fetchMock.mock.calls.find(([url]) => url.endsWith('/bookings'));
    expect(bookingsUrl).toBe(`${API_BASE_URL}/bookings`);
    expect(options.method).toBe('GET');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer test-token');

    completeBookings(bookingsResponse(response));

    const list = await screen.findByRole('list', { name: 'Your bookings' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('booking-2');
    expect(items[0]).toHaveTextContent('Awaiting-CAPTURE');
    expect(items[0]).toHaveTextContent('activity-2');
    expect(items[0]).toHaveTextContent('3');
    expect(items[0]).toHaveTextContent('2026-11-06T09:00:00.000Z');
    expect(items[1]).toHaveTextContent('booking-1');
    expect(items[1]).toHaveTextContent('settled_by_api');
    expect(list.textContent.indexOf('booking-2')).toBeLessThan(list.textContent.indexOf('booking-1'));
    expect(list).not.toHaveTextContent('private-user');
    expect(list).not.toHaveTextContent('payment-2');
    expect(list).not.toHaveTextContent('Hidden activity name');

    fireEvent.click(screen.getByRole('button', { name: /All activities/ }));
    expect(await screen.findByRole('heading', { name: 'Find your next activity' })).toBeInTheDocument();
  });

  it('shows an empty state for an empty response', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve(
      url.endsWith('/activities') ? jsonResponse([]) : jsonResponse([]),
    ));
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(screen.getByRole('button', { name: 'Set test token' }));
    fireEvent.click(screen.getByRole('button', { name: 'Review bookings' }));

    expect(await screen.findByText('You have no bookings yet.')).toBeInTheDocument();
  });

  it('shows a neutral API error and retries successfully', async () => {
    let bookingRequestCount = 0;
    const response = [{
      id: 'booking-1',
      activityId: 'activity-1',
      participants: 2,
      createdAt: '2026-11-07T09:00:00.000Z',
      paymentStatus: 'pending',
    }];
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/activities')) {
        return Promise.resolve(jsonResponse([]));
      }
      bookingRequestCount += 1;
      return Promise.resolve(bookingRequestCount === 1
        ? jsonResponse({ message: 'Sensitive API details' }, { ok: false, status: 503 })
        : jsonResponse(response));
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(screen.getByRole('button', { name: 'Set test token' }));
    fireEvent.click(screen.getByRole('button', { name: 'Review bookings' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Bookings could not be loaded.');
    expect(screen.getByRole('alert')).not.toHaveTextContent('Sensitive API details');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('list', { name: 'Your bookings' })).toHaveTextContent('booking-1');
    expect(bookingRequestCount).toBe(2);
  });

  it('shows a neutral error when the network request fails', async () => {
    let bookingRequestCount = 0;
    const response = [{
      id: 'booking-1',
      activityId: 'activity-1',
      participants: 2,
      createdAt: '2026-11-07T09:00:00.000Z',
      paymentStatus: 'pending',
    }];
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/activities')) {
        return Promise.resolve(jsonResponse([]));
      }
      bookingRequestCount += 1;
      return bookingRequestCount === 1
        ? Promise.reject(new TypeError('Failed to fetch'))
        : Promise.resolve(jsonResponse(response));
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenSetter /></>);
    fireEvent.click(screen.getByRole('button', { name: 'Set test token' }));
    fireEvent.click(screen.getByRole('button', { name: 'Review bookings' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Bookings could not be loaded.');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('list', { name: 'Your bookings' })).toHaveTextContent('booking-1');
    expect(bookingRequestCount).toBe(2);
    const bookingRequests = fetchMock.mock.calls.filter(([requestUrl]) => requestUrl.endsWith('/bookings'));
    expect(bookingRequests).toHaveLength(2);
    for (const [, options] of bookingRequests) {
      expect(new Headers(options.headers).get('Authorization')).toBe('Bearer test-token');
    }
  });
});

describe('authentication workflow', () => {
  it('enters the authenticated shell after login and returns to the account screen on remount', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve(
      url.endsWith('/login')
        ? jsonResponse({ accessToken: 'memory-token' })
        : jsonResponse([]),
    ));
    vi.stubGlobal('fetch', fetchMock);
    const storageWrites = vi.spyOn(Storage.prototype, 'setItem');

    const firstMount = renderApp();
    expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Activities' })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    const form = screen.getByRole('form', { name: 'Login' });
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(within(form).getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(await screen.findByText('There are no activities to show right now.')).toBeInTheDocument();
    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith('/activities'))).toHaveLength(1);
    expect(storageWrites).not.toHaveBeenCalled();

    firstMount.unmount();
    renderApp();
    expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith('/activities'))).toHaveLength(1);
    expect(storageWrites).not.toHaveBeenCalled();
  });

  it('requires terms for registration and shares the returned token with app consumers', async () => {
    let completeRegistration;
    const registrationResponse = new Promise((resolve) => {
      completeRegistration = resolve;
    });
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/activities')) {
        return Promise.resolve(jsonResponse([]));
      }
      return registrationResponse;
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenProbe /></>);
    const accountActions = screen.getByRole('group', { name: 'Account action' });
    fireEvent.click(within(accountActions).getByRole('button', { name: 'Create account' }));

    const form = screen.getByRole('form', { name: 'Registration' });
    const terms = within(form).getByRole('checkbox', { name: 'I accept the terms.' });
    const password = within(form).getByLabelText('Password');
    expect(password).toHaveAttribute('minlength', '6');
    expect(terms).toBeRequired();
    fireEvent.submit(form);
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(within(form).getByLabelText('Username'), { target: { value: 'alex' } });
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(terms);
    fireEvent.click(within(form).getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Creating account...', { selector: 'p' })).toBeInTheDocument();
    const [registrationUrl, options] = fetchMock.mock.calls.find(([url]) => url.endsWith('/users'));
    expect(registrationUrl).toBe(`${API_BASE_URL}/users`);
    expect(JSON.parse(options.body)).toEqual({
      email: 'alex@example.com',
      username: 'alex',
      password: 'password123',
      terms: true,
    });
    expect(within(form).getByRole('button', { name: 'Creating account...' })).toBeDisabled();
    expect(within(accountActions).getByRole('button', { name: 'Log in' })).toBeDisabled();
    expect(within(accountActions).getByRole('button', { name: 'Create account' })).toBeDisabled();

    completeRegistration(jsonResponse({ accessToken: 'registration-token' }));
    expect(await screen.findByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByLabelText('Available access token')).toHaveTextContent('registration-token');
  });

  it('shows pending login feedback, prevents duplicate requests, and shares the returned access token', async () => {
    let completeLogin;
    const loginResponse = new Promise((resolve) => {
      completeLogin = resolve;
    });
    const fetchMock = vi.fn((url) => (url.endsWith('/login')
      ? loginResponse
      : Promise.resolve(jsonResponse([]))));
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenProbe /></>);
    const form = screen.getByRole('form', { name: 'Login' });
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(within(form).getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Signing in...', { selector: 'p' })).toBeInTheDocument();
    expect(within(form).getByRole('button', { name: 'Signing in...' })).toBeDisabled();
    fireEvent.submit(form);
    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith('/login'))).toHaveLength(1);

    completeLogin(jsonResponse({ accessToken: 'login-token' }));
    expect(await screen.findByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByLabelText('Available access token')).toHaveTextContent('login-token');
    const [loginUrl, options] = fetchMock.mock.calls.find(([url]) => url.endsWith('/login'));
    expect(loginUrl).toBe(`${API_BASE_URL}/login`);
    expect(JSON.parse(options.body)).toEqual({
      email: 'alex@example.com',
      password: 'password123',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Load protected resource' }));
    const [protectedUrl, protectedOptions] = fetchMock.mock.calls.find(([url]) => url.endsWith('/protected-resource'));
    expect(protectedUrl).toBe(`${API_BASE_URL}/protected-resource`);
    expect(new Headers(protectedOptions.headers).get('Authorization')).toBe('Bearer login-token');
  });

  it('shows a login failure and allows corrected credentials to retry', async () => {
    let loginRequestCount = 0;
    const fetchMock = vi.fn((url) => {
      if (url.endsWith('/activities')) {
        return Promise.resolve(jsonResponse([]));
      }
      loginRequestCount += 1;
      return Promise.resolve(loginRequestCount === 1
        ? jsonResponse({ message: 'Invalid credentials' }, { ok: false, status: 401 })
        : jsonResponse({ accessToken: 'retry-token' }));
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp();
    const form = screen.getByRole('form', { name: 'Login' });
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'wrong-password' } });
    fireEvent.click(within(form).getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'correct-password' } });
    fireEvent.click(within(form).getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(loginRequestCount).toBe(2);
  });

  it('shows API registration validation details when account creation is rejected', async () => {
    const rejection = {
      message: 'Validation failed',
      errors: [{ field: 'email', message: 'Email is already registered' }],
    };
    const fetchMock = vi.fn((url) => Promise.resolve(
      url.endsWith('/activities')
        ? jsonResponse([])
        : jsonResponse(rejection, { ok: false, status: 400 }),
    ));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    const form = screen.getByRole('form', { name: 'Registration' });
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(within(form).getByLabelText('Username'), { target: { value: 'alex' } });
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(within(form).getByRole('checkbox', { name: 'I accept the terms.' }));
    fireEvent.click(within(form).getByRole('button', { name: 'Create account' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Validation failed');
    expect(alert).toHaveTextContent('Email is already registered');
    expect(alert).not.toHaveTextContent('Authentication failed');
  });
});
