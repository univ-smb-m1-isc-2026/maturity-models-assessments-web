describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form', () => {
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign in')
  })

  it('should handle successful login', () => {
    cy.intercept('POST', '**/api/auth/signin', {
      statusCode: 200,
      body: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        roles: ["ROLE_USER"],
        accessToken: "fake-jwt-token"
      }
    }).as('loginRequest')

    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginRequest')
    
    cy.url().should('include', '/profile')
  })

  it('should handle login error', () => {
    cy.intercept('POST', '**/api/auth/signin', {
      statusCode: 401,
      body: {
        message: "Bad credentials"
      }
    }).as('loginError')

    cy.get('input[name="email"]').type('wrong@example.com')
    cy.get('input[name="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()

    cy.wait('@loginError')
    
    cy.contains('Bad credentials').should('be.visible')
  })
})

describe('Registration', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should display registration form', () => {
    cy.get('input[name="firstName"]').should('be.visible')
    cy.get('input[name="lastName"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="confirmPassword"]').should('be.visible')
    cy.get('select[name="role"]').should('not.exist')
  })

  it('should handle registration', () => {
    cy.intercept('POST', '**/api/auth/signup', {
      statusCode: 200,
      body: {
        message: "User registered successfully!"
      }
    }).as('signupRequest')

    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('john.doe@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')
    
    cy.get('button[type="submit"]').click()

    cy.wait('@signupRequest').then((interception) => {
        expect(interception.request.body).to.not.have.property('roles')
    })
    
    cy.contains('User registered successfully!').should('be.visible')
  })

  it('should pre-fill email when provided in query params', () => {
    cy.visit('/register?email=invited@example.com')
    
    cy.get('input[name="email"]').should('have.value', 'invited@example.com')
    
    cy.get('input[name="firstName"]').type('Invited')
    cy.get('input[name="lastName"]').type('User')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')
    
    cy.get('button[type="submit"]').click()
  })

  it('should validate password mismatch', () => {
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="email"]').type('john.doe@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password456')
    cy.get('button[type="submit"]').click()

    cy.contains('Passwords do not match!').should('be.visible')
  })
})
