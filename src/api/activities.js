import { apiFetch } from './client';

export function getActivities() {
  return apiFetch('/activities');
}

export function getActivityById(id) {
  return apiFetch(`/activities/${encodeURIComponent(id)}`);
}