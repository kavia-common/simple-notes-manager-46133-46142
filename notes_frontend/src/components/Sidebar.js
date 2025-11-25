import React from 'react';
import { useNotes } from '../context/NotesContext';

/**
 * PUBLIC_INTERFACE
 * Sidebar
 */
export default function Sidebar() {
  /** Sidebar with search and list of notes. */
  const { state, filtered, setActive, setQuery } = useNotes();

  return (
    <div className="sidebar-root" role="navigation" aria-label="Notes navigation">
      <div className="sidebar-header">
        <label className="search" aria-label="Search notes">
          <span role="img" aria-hidden="true">🔎</span>
          <input
            aria-label="Search"
            placeholder="Search notes..."
            value={state.query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div style={{ alignSelf: 'center', fontSize: 12, color: 'var(--muted)' }}>
          {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      <div className="note-list" role="list">
        {filtered.length === 0 ? (
          <div className="empty">No notes match your search.</div>
        ) : (
          filtered.map(n => (
            <button
              key={n.id}
              className={`note-item ${state.activeId === n.id ? 'active' : ''}`}
              role="listitem"
              onClick={() => setActive(n.id)}
              aria-current={state.activeId === n.id ? 'true' : 'false'}
              title={n.title}
            >
              <div>
                <div className="note-title">{n.title || 'Untitled'}</div>
                <div className="note-meta">
                  {new Date(n.updatedAt || n.createdAt).toLocaleString()}
                </div>
              </div>
              <span aria-hidden="true">›</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
