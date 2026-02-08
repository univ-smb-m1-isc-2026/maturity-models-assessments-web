import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TeamsDashboard from '../TeamsDashboard';
import TeamService from '../../services/team.service';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/team.service');

describe('TeamsDashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders teams list', async () => {
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
    });
  });

  it('renders empty state', async () => {
    (TeamService.getUserTeams as any).mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <TeamsDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText(/You are not a member of any team yet/i)).toBeInTheDocument();
    });
  });
});
