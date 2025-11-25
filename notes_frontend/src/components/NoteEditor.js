import React, { useEffect, useRef } from 'react';
import { useNotes } from '../context/NotesContext';

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 */
export default function NoteEditor() {
  /** Editor for the currently active note with auto-save behavior. */
  const { activeNote, updateActive, deleteActive } = useNotes();
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, [activeNote?.id]);

  if (!activeNote) {
    return (
      <div className="empty" role="status">
        Select a note from the list or create a new one.
      </div>
    );
  }

  const onTitle = (e) => updateActive({ title: e.target.value });
  const onContent = (e) => updateActive({ content: e.target.value });

  return (
    <div className="editor-root">
      <div className="editor-header">
        <input
          className="title-input"
          placeholder="Note title"
          value={activeNote.title}
          onChange={onTitle}
          aria-label="Note title"
        />
        <button
          className="btn destructive"
          onClick={deleteActive}
          aria-label="Delete this note"
        >
          Delete
        </button>
      </div>

      <textarea
        ref={contentRef}
        className="content-area"
        placeholder="Start writing..."
        value={activeNote.content}
        onChange={onContent}
        aria-label="Note content"
      />

      <div className="editor-footer">
        <span className="badge">
          Last updated {new Date(activeNote.updatedAt || activeNote.createdAt).toLocaleString()}
        </span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          Changes are saved automatically
        </span>
      </div>
    </div>
  );
}
