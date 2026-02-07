import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Verify from '../Verify';
import AuthService from '../../services/auth.service';

vi.mock('../../services/auth.service');

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Verify Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders verify form', () => {
    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    expect(screen.getByText(/Account Verification/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Verification Code/i)).toBeInTheDocument();
  });

  it('pre-fills email from location state', () => {
    const state = { email: 'test@example.com' };
    render(
      <MemoryRouter initialEntries={[{ pathname: '/verify', state }]}>
        <Verify />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com');
  });

  it('handles successful verification', async () => {
    const user = userEvent.setup();
    (AuthService.verify as any).mockResolvedValue({ data: { message: 'Verification successful' } });

    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Verification Code/i), '123456');
    
    await user.click(screen.getByRole('button', { name: /Verify Account/i }));

    await waitFor(() => {
      expect(AuthService.verify).toHaveBeenCalledWith('test@example.com', '123456');
      expect(screen.getByText('Verification successful')).toBeInTheDocument();
      expect(screen.getByText(/Go to Login/i)).toBeInTheDocument();
    });
  });

  it('handles verification error', async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: { data: { message: 'Invalid code' } }
    };
    (AuthService.verify as any).mockRejectedValue(errorResponse);

    render(
      <MemoryRouter>
        <Verify />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Verification Code/i), '000000');
    
    await user.click(screen.getByRole('button', { name: /Verify Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid code')).toBeInTheDocument();
    });
  });
});
