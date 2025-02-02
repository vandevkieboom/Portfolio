import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, logout, LoginCredentials, getCurrentUser, User, getUsers } from '@/api/api';

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
