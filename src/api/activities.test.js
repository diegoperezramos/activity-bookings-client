import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL } from '../config';
import { getActivities, getActivityById } from './activities';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('activity requests', () => {
  it('requests the public activity list without authorization', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getActivities()).resolves.toEqual([]);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/activities`);
    expect(new Headers(options.headers).has('Authorization')).toBe(false);
  });

  it('requests the selected activity using its encoded identifier without authorization', async () => {
    const activity = { id: 'group/one', name: 'Example activity' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(activity),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getActivityById(activity.id)).resolves.toEqual(activity);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE_URL}/activities/group%2Fone`);
    expect(new Headers(options.headers).has('Authorization')).toBe(false);
  });
});