import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '../Profile';
import AuthService from '../../services/auth.service';

vi.mock('../../services/auth.service');

describe('Profile Component', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    using2FA: false
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (AuthService.getCurrentUser as any).mockReturnValue(mockUser);
  });

  it('renders user profile information', () => {
    render(<Profile />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders 2FA setup section when not enabled', () => {
    render(<Profile />);
    expect(screen.getByText(/Enable 2FA/i)).toBeInTheDocument();
  });

  it('handles 2FA setup flow', async () => {
    const user = userEvent.setup();
    (AuthService.generate2FA as any).mockResolvedValue({
        data: { secret: 'SECRET123', otpAuthUrl: 'otpauth://...' }
    });

    render(<Profile />);
    
    await user.click(screen.getByText(/Enable 2FA/i));
    
    await waitFor(() => {
        expect(screen.getByText(/Scan this QR Code/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/Enter code/i), '123456');
    
    (AuthService.enable2FA as any).mockResolvedValue({});
    
    await user.click(screen.getByText(/Verify & Enable/i));

    await waitFor(() => {
        expect(screen.getByText(/2FA Enabled successfully/i)).toBeInTheDocument();
        expect(AuthService.enable2FA).toHaveBeenCalledWith('SECRET123', '123456');
    });
  });

  it('handles 2FA disable', async () => {
    const user = userEvent.setup();
    (AuthService.getCurrentUser as any).mockReturnValue({ ...mockUser, using2FA: true });
    (AuthService.disable2FA as any).mockResolvedValue({});

    render(<Profile />);
    
    expect(screen.getByText(/Disable 2FA/i)).toBeInTheDocument();
    
    await user.click(screen.getByText(/Disable 2FA/i));
    
    await waitFor(() => {
        expect(AuthService.disable2FA).toHaveBeenCalled();
        expect(screen.getByText(/2FA Disabled/i)).toBeInTheDocument();
    });
  });
});
