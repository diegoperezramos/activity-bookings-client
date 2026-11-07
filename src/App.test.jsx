import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL } from './config';
import App, { getActivityDetailFields } from './App';

function jsonResponse(payload, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => payload };
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

    render(<App />);

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

    render(<App />);
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

    render(<App />);

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

    render(<App />);
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
