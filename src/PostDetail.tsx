import { useQuery, useMutation } from 'react-query'

interface Arguments {
  method: string
  data: {
    title: string
  }
}

interface Props {
  post: {
    id: number
    title: string
    body: string
  }
}

interface Item {
  id: number
  body: string
  email: string
}

interface ArrayData extends Array<Item> {}

interface Comments {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

async function fetchComments(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  )
  return response.json()
}

async function deletePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  )
  return response.json()
}

async function updatePost(postId: number) {
  const args: Arguments = {
    method: 'PATCH',
    data: { title: 'REACT QUERY FOREVER!!!!' },
  }
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    args
  )
  return response.json()
}

export function PostDetail({ post }: Props) {
  const { data, isLoading } = useQuery(['comments', post.id], () =>
    fetchComments(post.id)
  )

  const deleteMutation = useMutation((postId: number) => deletePost(postId))
  const updateMutation = useMutation((postId: number) => updatePost(postId))

  if (isLoading) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    )
  }

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: 'purple' }}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has been deleted</p>
      )}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isError && (
        <p style={{ color: 'red' }}>Error updating the post</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: 'purple' }}>Updating the post</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has been updated</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment: Comments) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  )
}
