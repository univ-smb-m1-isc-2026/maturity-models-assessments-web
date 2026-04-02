import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import AuthService from '../../services/auth.service'

vi.mock('../../services/auth.service')

describe('Home Component', () => {
  it('renders a normal landing page', () => {
    ;(AuthService.getCurrentUser as any).mockReturnValue(undefined)

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText(/Pilotez la maturité de vos équipes/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Créer un compte/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Se connecter/i })).toBeInTheDocument()
    expect(screen.queryByText(/API/i)).not.toBeInTheDocument()
  });
});
