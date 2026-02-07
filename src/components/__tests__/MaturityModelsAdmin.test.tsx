import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MaturityModelsAdmin from '../MaturityModelsAdmin';
import MaturityModelService from '../../services/maturity-model.service';

vi.mock('../../services/maturity-model.service');

const mockModels = [
  {
    id: '1',
    name: 'Model 1',
    questions: [
      { text: 'Q1', levels: [{ value: 1, description: 'L1' }] }
    ]
  },
  {
    id: '2',
    name: 'Model 2',
    questions: []
  }
];

describe('MaturityModelsAdmin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('renders list of models correctly', async () => {
    (MaturityModelService.getAllModels as any).mockResolvedValue({ data: mockModels });

    render(<MaturityModelsAdmin />);

    await waitFor(() => {
      expect(screen.getByText('Model 1')).toBeInTheDocument();
      expect(screen.getByText('Model 2')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    (MaturityModelService.getAllModels as any).mockReturnValue(new Promise(() => {}));
    render(<MaturityModelsAdmin />);
    expect(screen.getByText(/Loading models.../i)).toBeInTheDocument();
  });

  it('can delete a model', async () => {
    const user = userEvent.setup();
    (MaturityModelService.getAllModels as any).mockResolvedValue({ data: mockModels });
    (MaturityModelService.deleteModel as any).mockResolvedValue({});

    render(<MaturityModelsAdmin />);

    await waitFor(() => {
      expect(screen.getByText('Model 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(MaturityModelService.deleteModel).toHaveBeenCalledWith('1');
    expect(MaturityModelService.getAllModels).toHaveBeenCalledTimes(2); 
  });

  it('can switch to create mode and create a model', async () => {
    const user = userEvent.setup();
    (MaturityModelService.getAllModels as any).mockResolvedValue({ data: [] });
    (MaturityModelService.createModel as any).mockResolvedValue({});

    render(<MaturityModelsAdmin />);

    await waitFor(() => {
      expect(screen.getByText(/No maturity models defined/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText('Create New Model'));

    expect(screen.getByText('Create Maturity Model')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Model Name/i), 'New Model');
    
    await user.click(screen.getByText('Add Question'));
    const questionInput = screen.getByPlaceholderText(/e.g. How do you handle deployments?/i);
    await user.type(questionInput, 'New Question');

    for (let i = 1; i <= 5; i++) {
        const levelInput = screen.getByPlaceholderText(`Description for level ${i}`);
        await user.type(levelInput, `Level ${i} Desc`);
    }

    await user.click(screen.getByText('Save Model'));

    await waitFor(() => {
      expect(MaturityModelService.createModel).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Model',
        questions: expect.arrayContaining([
          expect.objectContaining({ text: 'New Question' })
        ])
      }));
      expect(screen.getByText(/Model created successfully/i)).toBeInTheDocument();
    });
  });

  it('can edit an existing model', async () => {
    const user = userEvent.setup();
    (MaturityModelService.getAllModels as any).mockResolvedValue({ data: mockModels });
    (MaturityModelService.updateModel as any).mockResolvedValue({});

    render(<MaturityModelsAdmin />);

    await waitFor(() => {
      expect(screen.getByText('Model 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(screen.getByText('Edit Maturity Model')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Model 1')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Model Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Model 1');

    await user.click(screen.getByText('Save Model'));

    await waitFor(() => {
      expect(screen.getByText('Model updated successfully!')).toBeInTheDocument();
    });

    expect(MaturityModelService.updateModel).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'Updated Model 1'
    })); 
    
    expect(screen.getByText(/Model updated successfully/i)).toBeInTheDocument();
  });

  it('can remove a question in edit mode', async () => {
    const user = userEvent.setup();
    (MaturityModelService.getAllModels as any).mockResolvedValue({ data: mockModels });

    render(<MaturityModelsAdmin />);

    await waitFor(() => {
      expect(screen.getByText('Model 1')).toBeInTheDocument();
    });

    await user.click(screen.getAllByText('Edit')[0]);

    expect(screen.getByDisplayValue('Q1')).toBeInTheDocument();

    await user.click(screen.getByText('Remove Question'));

    expect(screen.queryByDisplayValue('Q1')).not.toBeInTheDocument();
  });
});
