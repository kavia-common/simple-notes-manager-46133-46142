import React from 'react';
import { useNotes } from '../context/NotesContext';

/**
 * PUBLIC_INTERFACE
 * Header
 */
export default function Header() {
  /** App header with branding and quick actions. */
  const { createNote } = useNotes();

  return (
    <header className="header">
      <div className="brand" aria-label="App brand">
        <div className="brand-badge" aria-hidden="true" />
        <div>
          <div className="brand-title">Ocean Notes</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Modern, clean, fast</div>
        </div>
      </div>
      <div className="actions">
        <button className="btn primary" onClick={createNote} aria-label="Create a new note">
          + New Note
        </button>
      </div>
    </header>
  );
}
