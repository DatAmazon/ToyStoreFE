import api from './api';

export const registerApi = async (data: any) => {
  return await api.post('/api/Auth/register', data);
};

export const loginApi = async (data: any) => {
  return await api.post('/api/Auth/login', data);
};

export const googleLoginApi = async (idToken: string) => {
  return await api.post('/api/Auth/google-login', { idToken });
};
