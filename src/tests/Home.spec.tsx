import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from '../pages'
import { stripe } from '../services/stripe'
jest.mock('next-auth/react')

jest.mock('../services/stripe')
describe('Home Page', () => {
    it('reendeer correctly', () => {
        const amount = '$9.90'
        render(<Home product={{ priceId: 'fake', amount: amount }} />)

        expect(screen.getByText('for $9.90 month')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const retrievePricesStripeMocked = jest.mocked(stripe.prices.retrieve)

        retrievePricesStripeMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: "$10.00"
                    }
                }
            })
        )
    })
})