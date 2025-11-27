export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Post {
  id: number;
  content: string;
  author: User;
  likes: Like[];
  _count: {
    likes: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: number;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
