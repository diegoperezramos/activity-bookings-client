import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL } from '../config';
import { createBooking, getBookings } from './bookings';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('createBooking', () => {
  it('sends an authenticated JSON request and returns the API response unchanged', async () => {
    const request = { activityId: 'activity-1', participants: 2 };
    const bookingResponse = { id: 'booking-1', result: 'accepted' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(bookingResponse),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await createBooking({ ...request, jwt: 'test-token' });

    expect(result).toBe(bookingResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/bookings`);
    expect(options.method).toBe('POST');
    expect(new Headers(options.headers).get('Content-Type')).toBe('application/json');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer test-token');
    expect(JSON.parse(options.body)).toEqual(request);
    expect(typeof JSON.parse(options.body).participants).toBe('number');
  });

  it('retains the API error payload and HTTP status', async () => {
    const payload = { message: 'Booking rejected', errors: ['Participants are unavailable'] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: vi.fn().mockResolvedValue(payload),
    }));

    await expect(createBooking({
      activityId: 'activity-1',
      participants: 2,
      jwt: 'test-token',
    })).rejects.toMatchObject({
      message: 'Request failed with status 409',
      status: 409,
      payload,
    });
  });
});

describe('getBookings', () => {
  it('sends an authenticated GET request and returns the API array unchanged', async () => {
    const bookings = [
      { id: 'booking-2', paymentStatus: 'pending_review' },
      { id: 'booking-1', paymentStatus: 'settled' },
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(bookings),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getBookings({ jwt: 'test-token' });

    expect(result).toBe(bookings);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/bookings`);
    expect(options.method).toBe('GET');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer test-token');
    expect(options.body).toBeUndefined();
  });

  it('propagates HTTP/API failures', async () => {
    const payload = { message: 'Bookings unavailable' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: vi.fn().mockResolvedValue(payload),
    }));

    await expect(getBookings({ jwt: 'test-token' })).rejects.toMatchObject({
      message: 'Request failed with status 503',
      status: 503,
      payload,
    });
  });

  it('propagates network failures', async () => {
    const networkError = new TypeError('Failed to fetch');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

    await expect(getBookings({ jwt: 'test-token' })).rejects.toBe(networkError);
  });
});