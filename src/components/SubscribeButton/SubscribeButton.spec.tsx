import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { SubscribeButton } from '.'

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))
describe('Subscribe Button', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated",
        });
        render(<SubscribeButton />)
        expect(screen.getByText('Subscribe now')).toBeInTheDocument()
    })

    it('redirects user to sign in when not authenticated', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated",
        });

        const signInMocked = jest.mocked(signIn)
        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toBeCalled()
    })

    it('redirects to posts when user already has a subscription', () => {
        const userRouterMocked = jest.mocked(useRouter)

        const pushMock = jest.fn()

        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: {
                user:{
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                },
                expires:'fake',
                activeSubscription:true
            },
            status: "authenticated"
        });
        
        userRouterMocked.mockReturnValueOnce({
            push:pushMock
        } as any)
        
        render(<SubscribeButton />)

        const subscribeButton = screen.getByTestId('button-subscribe')

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled()
    })
})