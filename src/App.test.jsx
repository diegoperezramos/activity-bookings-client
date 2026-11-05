import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('App API health indicator', () => {
  it('shows the checking state while the health request is pending', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Checking API...');
  });

  it('shows available when the health endpoint reports ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'ok' }),
      }),
    );

    render(<App />);

    expect(await screen.findByRole('status')).toHaveTextContent('API available');
  });

  it('shows unavailable and logs when the health request fails', async () => {
    const requestError = new Error('Network unavailable');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(requestError));

    render(<App />);

    expect(await screen.findByRole('status')).toHaveTextContent('API unavailable');
    expect(console.error).toHaveBeenCalledWith(
      'Unable to check API health:',
      requestError,
    );
  });

  it('checks availability again when the button is clicked', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'ok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'starting' }),
      });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    expect(await screen.findByRole('status')).toHaveTextContent('API available');

    fireEvent.click(screen.getByRole('button', { name: 'Check availability' }));

    expect(await screen.findByRole('status')).toHaveTextContent('API unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
