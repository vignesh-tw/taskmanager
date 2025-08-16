// src/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const tokenStore = {
  get: () => localStorage.getItem('token'),
  set: (t) => localStorage.setItem('token', t),
  clear: () => localStorage.removeItem('token'),
};

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const t = tokenStore.get();
  if (auth && t) headers.Authorization = `Bearer ${t}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = res.statusText;
    try { const e = await res.json(); msg = e.message || msg; } catch {}
    throw new Error(msg);
  }
  try { return await res.json(); } catch { return {}; }
}

export const api = {
  // Auth
  register: (d) => request('/api/auth/register', { method: 'POST', body: d, auth: false }),
  login:    (d) => request('/api/auth/login',    { method: 'POST', body: d, auth: false }),

  // Tasks
  getTasks:   () => request('/api/tasks'),
  createTask: (d) => request('/api/tasks', { method: 'POST', body: d }),
  updateTask: (id, d) => request(`/api/tasks/${id}`, { method: 'PUT', body: d }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),

  // Therapists
  listTherapists: () => request('/api/therapists', { method: 'GET', auth: false }), 
  createTherapist: (d) => request('/api/therapists', { method: 'POST', body: d }),

  // Slots
  listSlots: (q = {}) => {
    const params = new URLSearchParams(q).toString();
    return request(`/api/slots${params ? `?${params}` : ''}`, { method: 'GET', auth: false });
  },
  createSlot: (d) => request('/api/slots', { method: 'POST', body: d }),

  // Bookings
  myBookings: () => request('/api/bookings/my'),
  createBooking: (d) => request('/api/bookings', { method: 'POST', body: d }),
  cancelBooking: (id) => request(`/api/bookings/${id}`, { method: 'DELETE' }),
};
