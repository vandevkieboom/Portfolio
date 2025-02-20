import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  login,
  logout,
  LoginCredentials,
  getCurrentUser,
  User,
  getUsers,
  getBlogs,
  Blog,
  createBlog,
  getBlogById,
  CreateBlogData,
  RegisterData,
  register,
  getComments,
  createComment,
  CreateCommentData,
  deleteComment,
  BlogComment,
} from '@/api/api';

export const useGetComments = (blogId: string) => {
  return useQuery<BlogComment[], Error>({
    queryKey: ['comments', blogId],
    queryFn: () => getComments(blogId),
    enabled: !!blogId,
  });
};

export const useCreateComment = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation<BlogComment, Error, CreateCommentData>({
    mutationFn: (data) => createComment(blogId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
    },
  });
};

export const useDeleteComment = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RegisterData>({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useGetBlogById = (id: string) => {
  return useQuery<Blog, Error>({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
    enabled: !!id,
  });
};

export const useGetBlogs = () => {
  return useQuery<Blog[], Error>({
    queryKey: ['blogs'],
    queryFn: getBlogs,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<Blog, Error, CreateBlogData>({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
    },
  });
};
