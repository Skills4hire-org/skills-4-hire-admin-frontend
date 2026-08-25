import {
  createPost,
  deletePost,
  editPost,
  getCommentReplies,
  getComments,
  getMyComments,
  getMyMedia,
  getMyPosts,
  getOffers,
  getPost,
  getJobApplications,
  getPosts,
  getRepostedBy,
  getUserComments,
  getUserPosts,
  likeComment,
  likePost,
  postComment,
  postReplies,
  repost,
  unlikeComment,
  unlikePost,
} from '@/api/posts'
import type { CreatePost, PostParams, SendComment } from '@/types/post.types'
import { toast } from 'sonner'
import {
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from '@tanstack/react-query'

export const useCreatePost = () => {
  const createPostAction = async (data: CreatePost) => {
    try {
      await createPost(data)
    } catch (error: any) {
      toast.error(error?.message)
    }
  }
  const queryClient = useQueryClient()
  const createPostFunction = useMutation({
    mutationFn: createPostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return createPostFunction
}
export const useEditPost = () => {
  const createPostAction = async ({
    post_id,
    data,
  }: {
    post_id?: string
    data: CreatePost
  }) => {
    try {
      await editPost({
        post_id,
        data,
      })
    } catch (error: any) {
      toast.error(error?.message)
    }
  }
  const queryClient = useQueryClient()
  const createPostFunction = useMutation({
    mutationFn: createPostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return createPostFunction
}
export const useDeletePost = () => {
  const deletePostAction = async ({ post_id }: { post_id?: string }) => {
    try {
      await deletePost({
        post_id,
      })
    } catch (error: any) {
      toast.error(error?.message)
    }
  }
  const queryClient = useQueryClient()
  const deletePostFunction = useMutation({
    mutationFn: deletePostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return deletePostFunction
}

export const usePosts = () => {
  const queryData = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => getPosts(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}

export const useOffers = ({
  tags_name,
  city,
  state,
  min_amount,
  max_amount,
}: PostParams) => {
  const queryData = useInfiniteQuery({
    queryKey: ['posts', tags_name, city, state, min_amount, max_amount],
    queryFn: ({ pageParam }) =>
      getOffers({ tags_name, city, state, min_amount, max_amount, pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}

export const useMyPosts = () => {
  const queryData = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => getMyPosts(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}
export const useUserPosts = ({ id }: { id?: string }) => {
  const queryData = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => getUserPosts({ pageParam, id }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}
export const useMyComments = () => {
  const queryData = useInfiniteQuery({
    queryKey: ['comments'],
    queryFn: ({ pageParam }) => getMyComments(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}
export const useUserComments = ({ id }: { id?: string }) => {
  const queryData = useInfiniteQuery({
    queryKey: ['comments'],
    queryFn: ({ pageParam }) => getUserComments({ pageParam, id }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}

export const useMyMedia = ({ user_id }: { user_id?: string }) => {
  const queryData = useInfiniteQuery({
    queryKey: ['media'],
    queryFn: ({ pageParam }) => getMyMedia({ pageParam, user_id }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}

export const usePost = ({ post_id }: PostParams) => {
  const getSinglePost = async () => {
    const post = await getPost({
      post_id,
    })
    return post
  }
  const queryData = useQuery({
    queryKey: ['posts', post_id],
    queryFn: getSinglePost,
  })

  return queryData
}

export const useLikePost = () => {
  const likePostAction = async ({
    post_id,
  }: {
    post_id: string | undefined
  }) => {
    await likePost({ post_id })
  }
  const queryClient = useQueryClient()
  const likePostFunction = useMutation({
    mutationFn: likePostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return likePostFunction
}

export const useUnlikePost = () => {
  const unlikePostAction = async (post_id: string | undefined) => {
    await unlikePost(post_id)
  }
  const queryClient = useQueryClient()
  const unlikePostFunction = useMutation({
    mutationFn: unlikePostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return unlikePostFunction
}

export const useRepost = () => {
  const repostAction = async ({ post_id }: { post_id: string | undefined }) => {
    await repost({ post_id })
  }
  const queryClient = useQueryClient()
  const repostFunction = useMutation({
    mutationFn: repostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return repostFunction
}

export const useComments = ({ post_id }: { post_id: string | undefined }) => {
  const queryData = useInfiniteQuery({
    queryKey: ['comments', post_id],
    queryFn: ({ pageParam }) => getComments({ pageParam, post_id }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}

export const usePostComment = () => {
  const postCommentAction = async ({
    post_id,
    data,
  }: {
    post_id: string | undefined
    data: SendComment
  }) => {
    try {
      await postComment({ post_id, data })
    } catch (error: any) {
      toast.error(error?.message)
    }
  }
  const queryClient = useQueryClient()
  const postCommentFunction = useMutation({
    mutationFn: postCommentAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  return postCommentFunction
}

export const usePostReplies = () => {
  const postRepliesAction = async ({
    post_id,
    comment_id,
    data,
  }: {
    post_id: string | undefined
    comment_id: string | undefined
    data: SendComment
  }) => {
    try {
      await postReplies({ post_id, comment_id, data })
    } catch (error: any) {
      toast.error(error?.message)
    }
  }
  const queryClient = useQueryClient()
  const postRepliesFunction = useMutation({
    mutationFn: postRepliesAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies'] })
    },
  })

  return postRepliesFunction
}

export const useLikeComment = () => {
  const likeCommentAction = async ({
    comment_id,
  }: {
    comment_id: string | undefined
  }) => {
    await likeComment({ comment_id })
  }
  const queryClient = useQueryClient()
  const likeCommentFunction = useMutation({
    mutationFn: likeCommentAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['replies'] })
    },
  })

  return likeCommentFunction
}

export const useUnlikeComment = () => {
  const unlikeCommentAction = async (comment_id: string | undefined) => {
    await unlikeComment(comment_id)
  }
  const queryClient = useQueryClient()
  const unlikeCommentFunction = useMutation({
    mutationFn: unlikeCommentAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['replies'] })
    },
  })

  return unlikeCommentFunction
}

export const useCommentReplies = ({
  post_id,
  comment_id,
}: {
  post_id: string | undefined
  comment_id: string | undefined
}) => {
  const queryData = useInfiniteQuery({
    queryKey: ['replies', comment_id],
    queryFn: ({ pageParam }) =>
      getCommentReplies({ pageParam, post_id, comment_id }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}

export const useRepostedBy = ({ post_id }: { post_id: string | undefined }) => {
  const queryData = useInfiniteQuery({
    queryKey: ['post', post_id],
    queryFn: ({ pageParam }) => getRepostedBy({ pageParam, post_id }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}

export const useJobApplications = () => {
  const queryData = useInfiniteQuery({
    queryKey: ['jobApplications'],
    queryFn: ({ pageParam }) => getJobApplications(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.next ?? undefined
    },
    retry: 1,
  })
  return queryData
}
