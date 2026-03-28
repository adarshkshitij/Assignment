import axios from 'axios';

export const API_URL = 'http://localhost:5000/api/v1';

const TOKEN_KEY = 'primetrade_token';

export const tokenStorage = {
  get() {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  set(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
};

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
    }

    return Promise.reject(error);
  }
);

export default api;
