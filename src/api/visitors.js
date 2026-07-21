import { apiRequest } from './client';

export async function getActiveVisitors(apartmentId) {
  const q = apartmentId ? `?apartmentId=${encodeURIComponent(apartmentId)}` : '';
  return apiRequest(`/visitors/active${q}`, { apartmentId });
}

export async function getVisitorHistory(apartmentId) {
  const q = apartmentId ? `?apartmentId=${encodeURIComponent(apartmentId)}` : '';
  return apiRequest(`/visitors/history${q}`, { apartmentId });
}

export async function getVisitorAnalytics(apartmentId) {
  const q = apartmentId ? `?apartmentId=${encodeURIComponent(apartmentId)}` : '';
  return apiRequest(`/visitors/analytics${q}`, { apartmentId });
}
