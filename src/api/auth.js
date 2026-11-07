import { apiFetch } from './client';

function postJson(path, payload) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function registerUser({ email, username, password, terms }) {
  return postJson('/users', { email, username, password, terms });
}

export function loginUser({ email, password }) {
  return postJson('/login', { email, password });
}
