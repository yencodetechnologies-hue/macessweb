import { apiRequest, clearAuthStorage, setStoredUser, setToken } from './client';

export async function login({ identifier, password, userType }) {
  const body = {
    email: identifier.trim(),
    password,
    userType,
  };

  if (userType === 'apartment') {
    const digits = identifier.replace(/\D/g, '').slice(-10);
    body.email = digits;
    body.mobile = digits;
    body.mobileNumber = digits;
  }

  if (userType === 'user' && /^\d{10}$/.test(identifier.trim())) {
    body.mobileNumber = identifier.trim();
  }

  const data = await apiRequest('/auth/login', { method: 'POST', body });

  if (data.token) setToken(data.token);
  if (data.user) setStoredUser(data.user);

  return data;
}

export async function fetchCurrentUser() {
  const data = await apiRequest('/auth/me');
  if (data.user) setStoredUser(data.user);
  return data.user ?? null;
}

export function logout() {
  clearAuthStorage();
}
