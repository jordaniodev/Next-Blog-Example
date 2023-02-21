import { render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import PostPreview, { getStaticProps } from '../pages/posts/preview/[slug]'
import { createClient } from '../services/prismic/prismic'
const post =
{
    slug: 'post-name',
    title: 'Post Title',
    updatedAt: 'March, 10',
    content: 'Post Excerpt'
}


jest.mock('../services/prismic/prismic')
jest.mock('next-auth/react')
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

describe('Post Page', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        });

        render(<PostPreview post={post} />)
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {

        const sessionMocked = jest.mocked(useSession)
        sessionMocked.mockReturnValueOnce({
            data: {
                activeSubscription: 'fake-subscription',
                
            }
        } as any)

        const userRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()
        userRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<PostPreview post={post} />)

        expect(pushMock).toHaveBeenCalled()

    })

    it('load data', async () => {

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


        const response = await waitFor(() => getStaticProps({
            params: {
                slug: post.slug,
            },
        } as any));

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug:post.slug,
                        title:'Post Title',
                        content:'<p>Post paragraph</p>',
                        updatedAt:'01 de abril de 2021'
                    }
                }
            })
        )
    })
})