
import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
})

describe(`ActiveLink Component`, () => {
    it('active link renders correctly', () => {
        render(
            <ActiveLink href="/" activeClassName='active'>
                <a>Home</a>
            </ActiveLink >)

        expect(screen.getByText(`Home`)).toBeInTheDocument()
    })
    it('active link is receive active class', () => {
        render(
            <ActiveLink href="/" activeClassName='active'>
                <a>Home</a>
            </ActiveLink >)

        expect(screen.getByText(`Home`)).toHaveClass(`active`)
    })
})