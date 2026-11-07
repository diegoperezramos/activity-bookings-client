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

    renderApp();

    expect(await screen.findByRole('button', { name: /Riverside Kayaking/ })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/activities`,
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    expect(new Headers(fetchMock.mock.calls[0][1].headers).has('Authorization')).toBe(false);
  });

  it('requests selected details publicly, displays required fields, and returns to the list', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([listedActivity]))
      .mockResolvedValueOnce(jsonResponse(detailedActivity));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();
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

  it('shows a list request failure and retries successfully', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(null, { ok: false, status: 503 }))
      .mockResolvedValueOnce(jsonResponse([listedActivity]));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

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

    renderApp();
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

describe('authentication workflow', () => {
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
    expect(terms).toBeRequired();
    fireEvent.submit(form);
    expect(fetchMock).toHaveBeenCalledTimes(1);

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
    expect(await screen.findByText('Account created.')).toBeInTheDocument();
    expect(screen.getByLabelText('Available access token')).toHaveTextContent('registration-token');
  });

  it('submits login credentials and shares the returned access token', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve(
      url.endsWith('/activities')
        ? jsonResponse([])
        : jsonResponse({ accessToken: 'login-token' }),
    ));
    vi.stubGlobal('fetch', fetchMock);

    renderApp(<><App /><AuthTokenProbe /></>);
    const form = screen.getByRole('form', { name: 'Login' });
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(within(form).getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('You are signed in.')).toBeInTheDocument();
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

  it('shows generic feedback when authentication fails', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve(
      url.endsWith('/activities')
        ? jsonResponse([])
        : jsonResponse(null, { ok: false, status: 401 }),
    ));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();
    const form = screen.getByRole('form', { name: 'Login' });
    fireEvent.change(within(form).getByLabelText('Email'), { target: { value: 'alex@example.com' } });
    fireEvent.change(within(form).getByLabelText('Password'), { target: { value: 'wrong-password' } });
    fireEvent.click(within(form).getByRole('button', { name: 'Log in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Authentication failed. Please try again.');
    expect(screen.queryByText(/401|status/i)).not.toBeInTheDocument();
  });
});
