import axios from 'axios';
import { AuthResponse, Post, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

export const postsAPI = {
  getAllPosts: () => api.get<ApiResponse<Post[]>>('/posts'),
  
  createPost: (content: string) =>
    api.post<ApiResponse<Post>>('/posts', { content }),
  
  toggleLike: (postId: number) =>
    api.post<ApiResponse<{ postId: number; likeCount: number; isLiked: boolean }>>(`/posts/${postId}/like`),
};

export default api;
