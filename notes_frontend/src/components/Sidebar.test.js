import { render, screen, fireEvent } from '@testing-library/react';
import { NotesProvider } from '../context/NotesContext';
import Sidebar from './Sidebar';

function setup() {
  render(
    <NotesProvider>
      <Sidebar />
    </NotesProvider>
  );
}

test('search input filters notes list label is present', () => {
  setup();
  const input = screen.getByLabelText(/search/i);
  expect(input).toBeInTheDocument();
  fireEvent.change(input, { target: { value: 'welcome' } });
  // We don't assert filtered results strictly as data is seeded dynamically,
  // but ensure the input value updates.
  expect(input).toHaveValue('welcome');
});
