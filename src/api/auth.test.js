import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL } from '../config';
import { loginUser, registerUser } from './auth';

function jsonResponse(payload) {
  return { ok: true, json: vi.fn().mockResolvedValue(payload) };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('authentication requests', () => {
  it('registers with the terms field and returns the API response unchanged', async () => {
    const response = { accessToken: 'registration-token', user: { id: 'user-1' } };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(response));
    vi.stubGlobal('fetch', fetchMock);

    await expect(registerUser({
      email: 'alex@example.com',
      username: 'alex',
      password: 'correct horse battery staple',
      terms: true,
    })).resolves.toBe(response);

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'alex@example.com',
        username: 'alex',
        password: 'correct horse battery staple',
        terms: true,
      }),
    });
  });

  it('logs in with only email and password and returns the API response unchanged', async () => {
    const response = { accessToken: 'login-token' };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(response));
    vi.stubGlobal('fetch', fetchMock);

    await expect(loginUser({
      email: 'alex@example.com',
      password: 'correct horse battery staple',
    })).resolves.toBe(response);

    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        email: 'alex@example.com',
        password: 'correct horse battery staple',
      }),
    });
  });
});
