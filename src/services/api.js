const API_URL = 'http://localhost:3001/api';

export async function obtenerInmuebles() {
  const response = await fetch(`${API_URL}/inmuebles`);
  return await response.json();
}

export async function obtenerInmueblePorId(id) {
  const response = await fetch(`${API_URL}/inmuebles/${id}`);
  return await response.json();
}