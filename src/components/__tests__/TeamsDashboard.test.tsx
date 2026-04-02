import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TeamsDashboard from '../TeamsDashboard';
import TeamService from '../../services/team.service';
import AuthService from '../../services/auth.service';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/team.service');
vi.mock('../../services/auth.service');

describe('TeamsDashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders teams list', async () => {
    (AuthService.getCurrentUser as any).mockReturnValue({ roles: ['ROLE_PMO'] });
    const mockTeams = [
        { id: '1', name: 'Team A', members: [] },
        { id: '2', name: 'Team B', members: [] }
    ];
    (TeamService.getUserTeams as any).mockResolvedValue({ data: mockTeams });

    render(
      <MemoryRouter>
        <TeamsDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Team A')).toBeInTheDocument();
        expect(screen.getByText('Team B')).toBeInTheDocument();
        expect(screen.getByText('Créer une équipe')).toBeInTheDocument();
    });
  });

  it('hides the creation panel for team members', async () => {
    (AuthService.getCurrentUser as any).mockReturnValue({ roles: ['ROLE_TEAM_MEMBER'] });
    (TeamService.getUserTeams as any).mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <TeamsDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Mes équipes')).toBeInTheDocument();
        expect(screen.queryByText('Créer une équipe')).not.toBeInTheDocument();
        expect(screen.getByText(/Vous ne faites encore partie d'aucune équipe/i)).toBeInTheDocument();
    });
  });
});