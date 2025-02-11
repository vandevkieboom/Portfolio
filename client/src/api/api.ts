import axios from '@/lib/axios';
import { AxiosResponse } from 'axios';

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author: {
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getBlogById = async (id: string): Promise<Blog> => {
  try {
    const response: AxiosResponse = await axios.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const response: AxiosResponse = await axios.get('/blogs');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBlog = async (data: { title: string; content: string }): Promise<Blog> => {
  try {
    const response: AxiosResponse = await axios.post('/blogs', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response: AxiosResponse = await axios.get('/user/me', { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response: AxiosResponse = await axios.get('/users', { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<void> => {
  try {
    await axios.post<AxiosResponse>('/login', credentials, { withCredentials: true });
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post<AxiosResponse>('/logout', {}, { withCredentials: true });
  } catch (error) {
    throw error;
  }
};
