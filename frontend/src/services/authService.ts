import { api } from './api';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  accessToken: string;
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },
};