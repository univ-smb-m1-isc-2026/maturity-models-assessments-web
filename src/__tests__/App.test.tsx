import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import AuthService from '../services/auth.service';

vi.mock('../services/auth.service');

vi.mock('../components/Login', () => ({ default: () => <div>Login Component</div> }));
vi.mock('../components/Register', () => ({ default: () => <div>Register Component</div> }));
vi.mock('../components/Profile', () => ({ default: () => <div>Profile Component</div> }));
vi.mock('../components/Verify', () => ({ default: () => <div>Verify Component</div> }));
vi.mock('../components/TeamsDashboard', () => ({ default: () => <div>TeamsDashboard Component</div> }));
vi.mock('../components/TeamDetails', () => ({ default: () => <div>TeamDetails Component</div> }));
vi.mock('../components/TeamInvitations', () => ({ default: () => <div>TeamInvitations Component</div> }));
vi.mock('../components/InvitationAccept', () => ({ default: () => <div>InvitationAccept Component</div> }));
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

    expect(screen.getByText('MMaturity')).toBeInTheDocument();
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
    expect(screen.queryByText('Équipes')).not.toBeInTheDocument();
    expect(screen.queryByText('Déconnexion')).not.toBeInTheDocument();
  });

  it('renders navigation for authenticated user', () => {
    const user = { firstName: 'John', lastName: 'Doe', roles: ['ROLE_USER'] };
    (AuthService.getCurrentUser as any).mockReturnValue(user);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('MMaturity')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Équipes')).toBeInTheDocument();
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
    expect(screen.queryByText('Créer un compte')).not.toBeInTheDocument();
    expect(screen.queryByText("Modèles d'évaluation")).not.toBeInTheDocument();
  });

  it('renders admin link for PMO user', () => {
    const user = { firstName: 'Admin', lastName: 'User', roles: ['ROLE_PMO'] };
    (AuthService.getCurrentUser as any).mockReturnValue(user);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Modèles d'évaluation")).toBeInTheDocument();
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

    const logoutButton = screen.getByText('Déconnexion');
    await userEventSetup.click(logoutButton);

    expect(AuthService.logout).toHaveBeenCalled();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });
});
