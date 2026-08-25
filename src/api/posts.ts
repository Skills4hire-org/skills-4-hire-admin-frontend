import type { CreatePost, PostParams, SendComment } from '@/types/post.types'
import { api } from '@/utils/axiosConfig'
import { handleApiError } from './error'

export const createPost = async (data: CreatePost) => {
  try {
    const response = await api.post('/api/v1/posts/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const editPost = async ({
  post_id,
  data,
}: {
  post_id?: string
  data: CreatePost
}) => {
  try {
    const response = await api.put(`/api/v1/posts/${post_id}/`, data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const deletePost = async ({ post_id }: { post_id?: string }) => {
  try {
    const response = await api.delete(`/api/v1/posts/${post_id}/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getPosts = async (pageParam?: string) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/posts/feed/?include_offer=False`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getOffers = async ({
  tags_name,
  city,
  state,
  min_amount,
  pageParam,
}: PostParams) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(
      `/api/v1/posts/feed/?include_offer=True&tags__name=${!tags_name || tags_name}&city=${!city || city}&state=${!state || state}&amount=${min_amount}`,
    )
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getMyPosts = async (pageParam?: string) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/posts/?include_mine=True`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}
export const getMyComments = async (pageParam?: string) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/comments/mine/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getPost = async ({ post_id }: PostParams) => {
  try {
    const response = await api.get(`/api/v1/posts?${post_id}/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const likePost = async ({
  post_id,
}: {
  post_id: string | undefined
}) => {
  try {
    const response = await api.post(`/api/v1/posts/${post_id}/like/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const unlikePost = async (post_id: string | undefined) => {
  try {
    const response = await api.delete(`/api/v1/posts/${post_id}/unlike/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const repost = async ({ post_id }: { post_id: string | undefined }) => {
  try {
    const response = await api.post(`/api/v1/posts/${post_id}/repost/`, {
      repost_quote: 'repost',
    })
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getComments = async ({
  post_id,
  pageParam,
}: {
  post_id: string | undefined
  pageParam: string | undefined
}) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/posts/${post_id}/comment/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const postComment = async ({
  post_id,
  data,
}: {
  post_id: string | undefined
  data: SendComment
}) => {
  try {
    const response = await api.post(`/api/v1/posts/${post_id}/comment/`, data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const postReplies = async ({
  post_id,
  comment_id,
  data,
}: {
  post_id: string | undefined
  comment_id: string | undefined
  data: SendComment
}) => {
  try {
    const response = await api.post(
      `/api/v1/posts/${post_id}/comment/${comment_id}/replies/`,
      data,
    )
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const likeComment = async ({
  comment_id,
}: {
  comment_id: string | undefined
}) => {
  try {
    const response = await api.post(`/api/v1/comments/${comment_id}/like/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const unlikeComment = async (comment_id: string | undefined) => {
  try {
    const response = await api.delete(`/api/v1/comments/${comment_id}/unlike/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getCommentReplies = async ({
  post_id,
  comment_id,
  pageParam,
}: {
  post_id: string | undefined
  comment_id: string | undefined
  pageParam: string | undefined
}) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(
      `/api/v1/posts/${post_id}}/comment/${comment_id}}/list-replies/`,
    )
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getRepostedBy = async ({
  post_id,
  pageParam,
}: {
  post_id: string | undefined
  pageParam: string | undefined
}) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/posts/${post_id}/reposts/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getMyMedia = async ({
  pageParam,
  user_id,
}: {
  pageParam?: string
  user_id?: string
}) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/images/user/${user_id}/activity/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const getUserPosts = async ({
  pageParam,
  id,
}: {
  pageParam?: string
  id?: string
}) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/posts/user/${id}/posts/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}
export const getJobApplications = async (pageParam?: string) => {
  try {
    const url = pageParam || '/api/v1/job/application/';
    const response = await api.get(url);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const getUserComments = async ({
  pageParam,
  id,
}: {
  pageParam?: string
  id?: string
}) => {
  try {
    if (pageParam) {
      const response = await api.get(pageParam)
      return response?.data
    }
    const response = await api.get(`/api/v1/comments/user/${id}/comments/`)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}
