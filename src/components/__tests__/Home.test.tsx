import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../Home';
import axios from 'axios';

vi.mock('axios');

describe('Home Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially', () => {
    (axios.get as any).mockImplementation(() => new Promise(() => {}));
    render(<Home />);
    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
  });

  it('renders success message from backend', async () => {
    (axios.get as any).mockResolvedValue({ data: { message: 'Hello from API' } });
    render(<Home />);
    
    await waitFor(() => {
        expect(screen.getByText('Hello from API')).toBeInTheDocument();
    });
  });

  it('renders error message when backend fails', async () => {
    (axios.get as any).mockRejectedValue(new Error('Network Error'));
    render(<Home />);
    
    await waitFor(() => {
        expect(screen.getByText(/Impossible de connecter au serveur backend/i)).toBeInTheDocument();
    });
  });
});
