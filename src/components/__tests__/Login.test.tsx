import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import AuthService from '../../services/auth.service';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/auth.service');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    (AuthService.login as any).mockResolvedValue({
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      roles: ['ROLE_USER']
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/Password/i), 'password');
    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('test@test.com', 'password', "");
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('handles login error', async () => {
    const user = userEvent.setup();
    (AuthService.login as any).mockRejectedValue(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/Password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('handles 2FA requirement', async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: {
        status: 403,
        data: { message: '2FA_REQUIRED' }
      }
    };
    (AuthService.login as any).mockRejectedValue(errorResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/Password/i), 'password');
    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Two-Factor Authentication required/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/2FA Code/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/2FA Code/i), '123456');
    
    (AuthService.login as any).mockResolvedValue({});
    
    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
        expect(AuthService.login).toHaveBeenCalledWith('test@test.com', 'password', '123456');
    });
  });
});
