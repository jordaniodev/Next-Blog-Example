import { render, screen, waitFor } from '@testing-library/react'
import Posts, { getStaticProps } from '../pages/posts'
import { createClient } from '../services/prismic/prismic'
const posts = [
    {
        slug: 'post-name',
        title: 'Post Name',
        updatedAt: 'March, 10',
        excerpt: 'Post Excerpt'
    }
]

jest.mock('../services/prismic/prismic')

describe('Posts Page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />)
        expect(screen.getByText('Post Name')).toBeInTheDocument()
    })

    it('load initial data', async () => {
        const createClientMocked = jest.mocked(createClient)

        createClientMocked.mockReturnValueOnce({
            getAllByType: jest.fn().mockResolvedValueOnce(

                [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [{ type: 'heading', text: 'Post Title' }],
                            content: [{ type: 'paragraph', text: 'Post paragraph' }]
                        },
                        last_publication_date: '04-01-2021'
                    }
                ]
            )
        } as any)

        const response = await waitFor(() => getStaticProps({}));


        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [
                        {
                            slug: 'my-new-post',
                            title: 'Post Title',
                            excerpt: 'Post paragraph',
                            updatedAt: '01 de abril de 2021'
                        }
                    ]
                }
            })
        )
    })
})