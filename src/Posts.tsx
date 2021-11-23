import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import { PostDetail } from './PostDetail'
const maxPostPage = 10

interface Data {
  id: number
  title: string
  body: string
}

async function fetchPosts(page: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
  )
  return response.json()
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedPost, setSelectedPost] = useState<Data | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery(
        ['posts', nextPage],
        () => fetchPosts(nextPage),
        {
          staleTime: 2000,
        }
      )
    }
  }, [currentPage, queryClient])

  // replace with useQuery
  const { data, isError, isLoading } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 20000,
      keepPreviousData: true,
    }
  )

  if (isLoading) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        <h3>Oops, something wen wrong</h3>
      </div>
    )
  }

  return (
    <>
      <ul>
        {data.map((post: Data) => (
          <li
            key={post.id}
            className='post-title'
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage === 1 ? true : false}
          onClick={() => {
            setCurrentPage(currentPage - 1)
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage === maxPostPage ? true : false}
          onClick={() => {
            setCurrentPage(currentPage + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  )
}
