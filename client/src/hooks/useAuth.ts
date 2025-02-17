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
} from '@/api/api';

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
