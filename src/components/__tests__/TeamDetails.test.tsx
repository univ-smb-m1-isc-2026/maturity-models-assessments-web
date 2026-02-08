import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamDetails from '../TeamDetails';
import TeamService from '../../services/team.service';
import AssessmentService from '../../services/assessment.service';
import MaturityModelService from '../../services/maturity-model.service';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../services/team.service');
vi.mock('../../services/assessment.service');
vi.mock('../../services/maturity-model.service');

describe('TeamDetails Component', () => {
  const mockTeam = {
    id: '1',
    name: 'Team Alpha',
    owner: { id: 'user1', email: 'owner@test.com', firstName: 'Owner', lastName: 'User' },
    members: [
        { id: 'user1', email: 'owner@test.com', firstName: 'Owner', lastName: 'User' },
        { id: 'user2', email: 'member@test.com', firstName: 'Member', lastName: 'One' }
    ]
  };

  const mockAssessments = [
      { id: 'a1', date: new Date().toISOString(), maturityModel: { name: 'DevOps' } }
  ];

  const mockModels = [
      { id: 'm1', name: 'DevOps' },
      { id: 'm2', name: 'Agile' }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders team details', async () => {
    (TeamService.getUserTeams as any).mockResolvedValue({ data: [mockTeam] });
    (AssessmentService.getTeamAssessments as any).mockResolvedValue({ data: mockAssessments });
    (MaturityModelService.getAllModels as any).mockResolvedValue({ data: mockModels });

    render(
      <MemoryRouter initialEntries={['/teams/1']}>
        <Routes>
            <Route path="/teams/:id" element={<TeamDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Team Alpha')).toBeInTheDocument();
    
    const ownerElement = await screen.findByText(/Led by:/);
    expect(ownerElement).toHaveTextContent('Owner User');
    
    expect(await screen.findByText(/Member One/)).toBeInTheDocument();
  });

  it('handles invite member', async () => {
    const user = userEvent.setup();
    (TeamService.getUserTeams as any).mockResolvedValue({ data: [mockTeam] });
    (AssessmentService.getTeamAssessments as any).mockResolvedValue({ data: [] });
    (MaturityModelService.getAllModels as any).mockResolvedValue({ data: [] });
    (TeamService.inviteMember as any).mockResolvedValue({ data: { message: 'Invitation sent' } });

    render(
      <MemoryRouter initialEntries={['/teams/1']}>
        <Routes>
            <Route path="/teams/:id" element={<TeamDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Team Alpha')).toBeInTheDocument());

    await user.type(screen.getByLabelText(/Email Address/i), 'new@test.com');
    await user.click(screen.getByRole('button', { name: /Send Invitation/i }));

    await waitFor(() => {
        expect(TeamService.inviteMember).toHaveBeenCalledWith('1', 'new@test.com');
        expect(screen.getByText('Invitation sent')).toBeInTheDocument();
    });
  });
});
