import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import AuthService from '../services/auth.service';

vi.mock('../services/auth.service');

vi.mock('../components/Login', () => ({ default: () => <div>Login Component</div> }));
vi.mock('../components/Register', () => ({ default: () => <div>Register Component</div> }));
vi.mock('../components/Home', () => ({ default: () => <div>Home Component</div> }));
vi.mock('../components/Profile', () => ({ default: () => <div>Profile Component</div> }));
vi.mock('../components/Verify', () => ({ default: () => <div>Verify Component</div> }));
vi.mock('../components/TeamsDashboard', () => ({ default: () => <div>TeamsDashboard Component</div> }));
vi.mock('../components/TeamDetails', () => ({ default: () => <div>TeamDetails Component</div> }));
vi.mock('../components/MaturityModelsAdmin', () => ({ default: () => <div>MaturityModelsAdmin Component</div> }));
vi.mock('../components/AssessmentView', () => ({ default: () => <div>AssessmentView Component</div> }));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation for guest user', () => {
    (AuthService.getCurrentUser as any).mockReturnValue(undefined);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Maturity Assessment')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('Teams')).not.toBeInTheDocument();
    expect(screen.queryByText('LogOut')).not.toBeInTheDocument();
  });

  it('renders navigation for authenticated user', () => {
    const user = { firstName: 'John', lastName: 'Doe', roles: ['ROLE_USER'] };
    (AuthService.getCurrentUser as any).mockReturnValue(user);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Maturity Assessment')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('LogOut')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    expect(screen.queryByText('Maturity Models')).not.toBeInTheDocument();
  });

  it('renders admin link for PMO user', () => {
    const user = { firstName: 'Admin', lastName: 'User', roles: ['ROLE_PMO'] };
    (AuthService.getCurrentUser as any).mockReturnValue(user);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Maturity Models')).toBeInTheDocument();
  });

  it('handles logout', async () => {
    const user = { firstName: 'John', lastName: 'Doe', roles: ['ROLE_USER'] };
    (AuthService.getCurrentUser as any).mockReturnValue(user);
    const userEventSetup = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('LogOut');
    await userEventSetup.click(logoutButton);

    expect(AuthService.logout).toHaveBeenCalled();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
