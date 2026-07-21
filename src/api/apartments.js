import { apiRequest } from './client';

export async function listApartments() {
  return apiRequest('/apartments');
}

export async function getApartment(id) {
  return apiRequest(`/apartments/${id}`);
}

export async function createCompanyPublic(payload) {
  return apiRequest('/apartments/public-company', {
    method: 'POST',
    body: payload,
  });
}

export async function createApartment(payload) {
  return apiRequest('/apartments', {
    method: 'POST',
    body: payload,
  });
}

export async function listCompanies(apartments) {
  return (apartments || []).filter((a) => a.propertyType === 'company');
}
