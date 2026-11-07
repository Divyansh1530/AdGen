export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
}

export interface RegisterInput {
  name?: string | undefined;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}
