import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AssessmentView from '../AssessmentView';
import AssessmentService from '../../services/assessment.service';
import AuthService from '../../services/auth.service';

vi.mock('../../services/assessment.service');
vi.mock('../../services/auth.service');

const mockAssessment = {
  id: '1',
  date: '2023-01-01',
  team: { id: 'team1', name: 'Team Alpha' },
  maturityModel: {
    id: 'mm1',
    name: 'DevOps Model',
    questions: [
      {
        text: 'Question 1',
        levels: [
          { value: 1, description: 'Level 1 desc' },
          { value: 2, description: 'Level 2 desc' }
        ]
      }
    ]
  },
  answers: [
    { questionText: 'Question 1', selectedLevel: 1, comment: 'Initial comment' }
  ]
};

describe('AssessmentView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (AuthService.getCurrentUser as any).mockReturnValue({ id: 'user1' });
  });

  it('renders loading state initially', () => {
    (AssessmentService.getAssessment as any).mockReturnValue(new Promise(() => {}));
    
    render(
      <MemoryRouter initialEntries={['/assessments/1']}>
        <Routes>
          <Route path="/assessments/:id" element={<AssessmentView />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading assessment.../i)).toBeInTheDocument();
  });

  it('renders assessment details after loading', async () => {
    (AssessmentService.getAssessment as any).mockResolvedValue({ data: mockAssessment });

    render(
      <MemoryRouter initialEntries={['/assessments/1']}>
        <Routes>
          <Route path="/assessments/:id" element={<AssessmentView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Assessment: DevOps Model/i)).toBeInTheDocument();
      expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });
  });

  it('handles error loading assessment', async () => {
    (AssessmentService.getAssessment as any).mockRejectedValue(new Error('Failed to load'));

    render(
      <MemoryRouter initialEntries={['/assessments/1']}>
        <Routes>
          <Route path="/assessments/:id" element={<AssessmentView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading assessment/i)).toBeInTheDocument();
    });
  });

  it('allows changing answers and saving', async () => {
    const user = userEvent.setup();
    (AssessmentService.getAssessment as any).mockResolvedValue({ data: mockAssessment });
    (AssessmentService.submitAssessment as any).mockResolvedValue({ data: mockAssessment });

    render(
      <MemoryRouter initialEntries={['/assessments/1']}>
        <Routes>
          <Route path="/assessments/:id" element={<AssessmentView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    const radioLevel2 = screen.getByLabelText(/Level 2/i);
    await user.click(radioLevel2);

    const commentBox = screen.getByLabelText(/Comments/i);
    await user.clear(commentBox);
    await user.type(commentBox, 'Updated comment');

    const saveButton = screen.getByRole('button', { name: /Save Assessment/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(AssessmentService.submitAssessment).toHaveBeenCalledWith('1', expect.any(Array));
    });
  });

  it('handles save error', async () => {
    const user = userEvent.setup();
    (AssessmentService.getAssessment as any).mockResolvedValue({ data: mockAssessment });
    (AssessmentService.submitAssessment as any).mockRejectedValue(new Error('Save failed'));

    render(
      <MemoryRouter initialEntries={['/assessments/1']}>
        <Routes>
          <Route path="/assessments/:id" element={<AssessmentView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    const saveButton = screen.getByRole('button', { name: /Save Assessment/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Error saving assessment/i)).toBeInTheDocument();
    });
  });
});
