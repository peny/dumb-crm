import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

// Mock the auth context
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));

const MockedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App Component', () => {
  test('renders login page by default', () => {
    render(<MockedApp />);
    
    expect(screen.getByText('Sign in to Dumb CRM')).toBeInTheDocument();
  });

  test('has proper routing structure', () => {
    render(<MockedApp />);
    
    // Should show login form elements
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
