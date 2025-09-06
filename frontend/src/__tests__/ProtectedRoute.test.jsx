import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';

const MockedProtectedRoute = ({ children, requireAdmin = false }) => (
  <BrowserRouter>
    <ProtectedRoute requireAdmin={requireAdmin}>
      {children}
    </ProtectedRoute>
  </BrowserRouter>
);

describe('ProtectedRoute Component', () => {
  test('shows loading spinner when loading', () => {
    vi.mock('../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        loading: true,
        isAdmin: () => false,
      }),
    }));

    render(
      <MockedProtectedRoute>
        <div>Protected Content</div>
      </MockedProtectedRoute>
    );
    
    // Should show loading spinner
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    vi.mock('../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        loading: false,
        isAdmin: () => false,
      }),
    }));

    render(
      <MockedProtectedRoute>
        <div>Protected Content</div>
      </MockedProtectedRoute>
    );
    
    // Should redirect to login (this would be handled by Navigate component)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('shows content when authenticated', () => {
    vi.mock('../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        loading: false,
        isAdmin: () => false,
      }),
    }));

    render(
      <MockedProtectedRoute>
        <div>Protected Content</div>
      </MockedProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('shows access denied for non-admin on admin routes', () => {
    vi.mock('../contexts/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        loading: false,
        isAdmin: () => false,
      }),
    }));

    render(
      <MockedProtectedRoute requireAdmin={true}>
        <div>Admin Content</div>
      </MockedProtectedRoute>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('You need admin privileges to access this page.')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
