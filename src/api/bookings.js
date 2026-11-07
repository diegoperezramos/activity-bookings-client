import { apiFetch } from './client';

export function createBooking({ activityId, participants, jwt }) {
  return apiFetch('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, participants }),
    jwt,
  });
}

export function getBookings({ jwt }) {
  return apiFetch('/bookings', {
    method: 'GET',
    jwt,
  });
}