
import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { SignInButton } from '../SingInButton'

jest.mock('next-auth/react')

describe(`SignInButton Component`, () => {
    it('SignInButton renders correctly when user is not authenticated', () => {

        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        });

        render(<SignInButton />)
        expect(screen.getByText(`Sign in with github`)).toBeInTheDocument()
    })

    it('SignInButton renders correctly when user is authenticated', () => {

        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: {
                user:{
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                },
                expires:'fake'
            },
            status: "authenticated"
        });

        render(<SignInButton />)
        expect(screen.getByText(`John Doe`)).toBeInTheDocument()
    })
})