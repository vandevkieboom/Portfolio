import axios from '@/lib/axios';
import { AxiosResponse } from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Tag {
  id: number;
  name: string;
  blogId: number;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author: {
    username: string;
  };
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  tags: string[];
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

export const createBlog = async (data: CreateBlogData): Promise<Blog> => {
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
