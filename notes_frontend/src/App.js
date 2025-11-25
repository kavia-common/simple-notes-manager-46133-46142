import React from 'react';
import './App.css';
import './index.css';
import { NotesProvider } from './context/NotesContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';

// PUBLIC_INTERFACE
function App() {
  /** Root app rendering the split layout for notes app. */
  return (
    <NotesProvider>
      <div className="ocean-app">
        <Header />
        <main className="layout">
          <aside className="sidebar" aria-label="Notes list">
            <Sidebar />
          </aside>
          <section className="editor" aria-label="Note editor">
            <NoteEditor />
          </section>
        </main>
      </div>
    </NotesProvider>
  );
}

export default App;
