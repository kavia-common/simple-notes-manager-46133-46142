function safeParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

const prefix = 'notesapp:';

// PUBLIC_INTERFACE
export const storage = {
  /** Get a value from localStorage by key (namespaced). */
  get(key, defaultValue = null) {
    try {
      const raw = window.localStorage.getItem(prefix + key);
      if (raw == null) return defaultValue;
      return safeParse(raw, defaultValue);
    } catch {
      return defaultValue;
    }
  },
  /** Set a value in localStorage by key (namespaced). */
  set(key, value) {
    try {
      window.localStorage.setItem(prefix + key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  /** Remove a key from localStorage (namespaced). */
  remove(key) {
    try { window.localStorage.removeItem(prefix + key); } catch { /* ignore */ }
  }
};
