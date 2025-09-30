const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5003';

export async function req(path, method = 'GET', body, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  const t = localStorage.getItem('token');
  if (auth && t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    let m = res.statusText;
    try { m = (await res.json()).message || m; } catch {}
    throw new Error(m);
  }
  try { return await res.json(); } catch { return {}; }
}


export const listTherapists = () => req('/api/therapists', 'GET', null, false);
export const createTherapist = (d) => req('/api/therapists', 'POST', d);
export const updateTherapist = (id, d) => req(`/api/therapists/${id}`, 'PUT', d);
export const deleteTherapist = (id) => req(`/api/therapists/${id}`, 'DELETE');


export const listSlots = (q) => {
  const qs = new URLSearchParams(q || {}).toString();
  return req(`/api/slots${qs ? `?${qs}` : ''}`, 'GET', null, false);
};
export const createSlot = (d) => req('/api/slots', 'POST', d);
export const deleteSlot = (id) => req(`/api/slots/${id}`, 'DELETE'); // if you add a delete route later


export const myBookings = () => req('/api/bookings/my');
export const createBooking = (d) => req('/api/bookings', 'POST', d);
export const cancelBooking = (id) => req(`/api/bookings/${id}`, 'DELETE');
