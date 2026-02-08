import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../Register';
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

describe('Register Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
  });

  it('validates password mismatch', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/^Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^Password$/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password456');
    await user.click(screen.getByRole('button', { name: /Sign up/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(AuthService.register).not.toHaveBeenCalled();
  });

  it('handles successful registration', async () => {
    const user = userEvent.setup();
    (AuthService.register as any).mockResolvedValue({ data: { message: 'User registered successfully!' } });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/^Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Sign up/i }));

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith('John', 'Doe', 'john@example.com', 'password123');
      expect(screen.getByText(/User registered successfully/i)).toBeInTheDocument();
    });
  });
});
