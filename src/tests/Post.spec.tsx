import { render, screen, waitFor } from '@testing-library/react'
import { getSession } from 'next-auth/react'
import Post, { getServerSideProps } from '../pages/posts/[slug]'
import { createClient } from '../services/prismic/prismic'
const post =
{
    slug: 'post-name',
    title: 'Post Name',
    updatedAt: 'March, 10',
    content: 'Post Excerpt'
}


jest.mock('../services/prismic/prismic')
jest.mock('next-auth/react')

describe('Post Page', () => {
    it('renders correctly', () => {
        render(<Post post={post} />)
        expect(screen.getByText('Post Name')).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {
        const createClientMocked = jest.mocked(createClient)

        createClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce(post)
        } as any)

        const sessionMocked = jest.mocked(getSession)

        sessionMocked.mockReturnValueOnce({
            activeSubscription: null
        } as any)

        const response = await waitFor(() => getServerSideProps({
            req: {
                cookies: {}
            },
        } as any));


        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                    permanent: false
                })
            })
        )
    })

    it('load data if subscription is found', async () => {
        const sessionMocked = jest.mocked(getSession)

        sessionMocked.mockReturnValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        const createClientMocked = jest.mocked(createClient)

        createClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce(
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [{ type: 'heading', text: 'Post Title' }],
                            content: [{ type: 'paragraph', text: 'Post paragraph' }]
                        },
                        last_publication_date: '04-01-2021'
                    }
            )
        } as any)


        const response = await waitFor(() => getServerSideProps({
            req: {
                cookies: {}
            },
        } as any));
        
        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                    permanent: false
                })
            })
        )
    })
})