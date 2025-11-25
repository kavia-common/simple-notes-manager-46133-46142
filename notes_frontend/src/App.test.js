import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const title = screen.getByText(/Ocean Notes/i);
  expect(title).toBeInTheDocument();
});

test('can create a new note from header button', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /new note/i });
  fireEvent.click(button);
  // After creating, an editor should be visible with default title
  const titleInput = screen.getByLabelText(/note title/i);
  expect(titleInput).toBeInTheDocument();
});
