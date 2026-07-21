import { apiRequest } from './client';

export async function listBlocks(apartmentId) {
  const q = apartmentId ? `?apartmentId=${encodeURIComponent(apartmentId)}` : '';
  return apiRequest(`/blocks${q}`, { apartmentId });
}

export async function createBlock({ name, apartmentId }) {
  return apiRequest('/blocks', {
    method: 'POST',
    body: { name, apartmentId },
    apartmentId,
  });
}

export async function addFloor(blockId, payload) {
  return apiRequest(`/blocks/${blockId}/floors`, {
    method: 'POST',
    body: payload,
  });
}

export async function addRoom(blockId, floorId, payload) {
  return apiRequest(`/blocks/${blockId}/floors/${floorId}/rooms`, {
    method: 'POST',
    body: payload,
  });
}
