import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { createServer } from '../../test/server'
import AuthButtons from './AuthButtons'

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  )

  await screen.findAllByRole('link')
}

describe('when user is not signed in', () => {
  // createServer ---> GET '/api/user' ---> { user: null }
  createServer([
    {
      path: '/api/user',
      res: () => {
        console.log('NOT LOGGED IN RESPONSE')

        return { user: null }
      }
    }
  ])

  test('sign in and sign up button are visible', async () => {
    await renderComponent()

    const signInButton = screen.getByRole('link', { name: /sign in/i })
    const signUpButton = screen.getByRole('link', { name: /sign up/i })

    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveAttribute('href', '/signin')
    expect(signUpButton).toBeInTheDocument()
    expect(signUpButton).toHaveAttribute('href', '/signup')
  })

  test('sign out button is not visible', async () => {
    await renderComponent()

    const signOutButton = screen.queryByRole('link', { name: /sign out/i })
    expect(signOutButton).not.toBeInTheDocument()
  })
})

describe('when user is signed in', () => {
  // createServer ---> GET '/api/user' ---> { user: { id: 1: email: 'aoeu#a.com' } }
  createServer([
    {
      path: '/api/user',
      res: () => {
        console.log('LOGGED IN RESPONSE')
        return { user: { id: 1, email: 'aoeu@a.com' } }
      }
    }
  ])

  test('when user is signed in, sign in sign up button are not visible', async () => {
    await renderComponent()

    const signInButton = screen.queryByRole('link', { name: /sign in/i })
    const signUpButton = screen.queryByRole('link', { name: /sign up/i })

    expect(signInButton).not.toBeInTheDocument()
    expect(signUpButton).not.toBeInTheDocument()
  })

  test('when user is signed in, sign out is visible', async () => {
    await renderComponent()

    const signOutButton = screen.getByRole('link', { name: /sign out/i })

    expect(signOutButton).toBeInTheDocument()
    expect(signOutButton).toHaveAttribute('href', '/signout')
  })
})