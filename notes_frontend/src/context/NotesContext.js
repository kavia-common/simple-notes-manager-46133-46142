import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { notesApi } from '../services/notesApi';
import { storage } from '../services/storage';

/** Types */
export const initialState = {
  notes: [],
  activeId: null,
  query: '',
  loaded: false,
};

function seedSample() {
  const now = new Date().toISOString();
  return [
    { id: crypto.randomUUID(), title: 'Welcome 👋', content: 'This is your new notes app. Start typing!', createdAt: now, updatedAt: now },
    { id: crypto.randomUUID(), title: 'Tips', content: '- Use search to filter\n- Click a note to edit\n- Data persists in your browser', createdAt: now, updatedAt: now },
  ];
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loaded: true, activeId: action.payload[0]?.id ?? null };
    case 'ADD_NOTE': {
      const updated = [action.payload, ...state.notes];
      return { ...state, notes: updated, activeId: action.payload.id };
    }
    case 'UPDATE_NOTE': {
      const updated = state.notes.map(n => n.id === action.payload.id ? { ...n, ...action.payload, updatedAt: new Date().toISOString() } : n);
      return { ...state, notes: updated };
    }
    case 'DELETE_NOTE': {
      const updated = state.notes.filter(n => n.id !== action.payload);
      const stillActive = state.activeId === action.payload ? updated[0]?.id ?? null : state.activeId;
      return { ...state, notes: updated, activeId: stillActive };
    }
    case 'SET_ACTIVE':
      return { ...state, activeId: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    default:
      return state;
  }
}

const NotesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useNotes
 */
export function useNotes() {
  /** Hook to access notes state and actions. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * NotesProvider
 */
export function NotesProvider({ children }) {
  /** Provider that manages notes with localStorage persistence and optional backend usage. */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load notes from API or localStorage
  useEffect(() => {
    async function load() {
      try {
        let existing = await notesApi.list();
        if (!existing || existing.length === 0) {
          // fall back to local storage
          existing = storage.get('notes') || [];
        }
        if (!existing || existing.length === 0) {
          existing = seedSample();
        }
        dispatch({ type: 'SET_NOTES', payload: existing });
      } catch {
        let existing = storage.get('notes') || [];
        if (!existing || existing.length === 0) existing = seedSample();
        dispatch({ type: 'SET_NOTES', payload: existing });
      }
    }
    load();
  }, []);

  // Persist to storage whenever notes change
  useEffect(() => {
    if (state.loaded) {
      storage.set('notes', state.notes);
    }
  }, [state.notes, state.loaded]);

  const actions = useMemo(() => ({
    // PUBLIC_INTERFACE
    createNote: async () => {
      const now = new Date().toISOString();
      const draft = { id: crypto.randomUUID(), title: 'Untitled', content: '', createdAt: now, updatedAt: now };
      try {
        const created = await notesApi.create(draft);
        dispatch({ type: 'ADD_NOTE', payload: created || draft });
      } catch {
        dispatch({ type: 'ADD_NOTE', payload: draft });
      }
    },
    // PUBLIC_INTERFACE
    setActive: (id) => dispatch({ type: 'SET_ACTIVE', payload: id }),
    // PUBLIC_INTERFACE
    updateActive: async (fields) => {
      const active = state.notes.find(n => n.id === state.activeId);
      if (!active) return;
      const updated = { ...active, ...fields };
      dispatch({ type: 'UPDATE_NOTE', payload: updated });
      try { await notesApi.update(updated.id, updated); } catch { /* ignore */ }
    },
    // PUBLIC_INTERFACE
    deleteActive: async () => {
      const id = state.activeId;
      if (!id) return;
      dispatch({ type: 'DELETE_NOTE', payload: id });
      try { await notesApi.remove(id); } catch { /* ignore */ }
    },
    // PUBLIC_INTERFACE
    setQuery: (q) => dispatch({ type: 'SET_QUERY', payload: q }),
  }), [state.activeId, state.notes]);

  const filtered = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    if (!q) return state.notes;
    return state.notes.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [state.notes, state.query]);

  const activeNote = useMemo(
    () => state.notes.find(n => n.id === state.activeId) || null,
    [state.notes, state.activeId]
  );

  const value = useMemo(() => ({
    state,
    filtered,
    activeNote,
    ...actions,
  }), [state, filtered, activeNote, actions]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
