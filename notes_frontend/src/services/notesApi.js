const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * A minimal API client. If REACT_APP_API_BASE is not defined, the methods resolve to local no-ops.
 */
async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

const remote = {
  async list() { return http('GET', '/notes'); },
  async create(note) { return http('POST', '/notes', note); },
  async update(id, note) { return http('PUT', `/notes/${id}`, note); },
  async remove(id) { return http('DELETE', `/notes/${id}`); },
};

const localNoop = {
  async list() { return []; },
  async create(note) { return note; },
  async update(_id, note) { return note; },
  async remove() { return null; },
};

// PUBLIC_INTERFACE
export const notesApi = API_BASE ? remote : localNoop;
