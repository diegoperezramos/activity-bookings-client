import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiFetch } from './client';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('apiFetch', () => {
  it('prefixes the API base URL and parses the JSON response', async () => {
    const payload = { status: 'ok' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/health')).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/health`,
      { headers: new Headers() },
    );
  });

  it('throws an error carrying the HTTP status for a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );

    await expect(apiFetch('/health')).rejects.toMatchObject({
      message: 'Request failed with status 503',
      status: 503,
    });
  });

  it('sends an optional JWT as a bearer authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/bookings', { jwt: 'test-token' });

    const headers = new Headers(fetchMock.mock.calls[0][1].headers);
    expect(headers.get('Authorization')).toBe('Bearer test-token');
  });
});
