// src/lib/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

// Handle error responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized globally if needed
    if (error.response && error.response.status === 401) {
      removeToken();
      // Optionally, redirect to login page
    }
    return Promise.reject(error);
  }
);

// Helper methods
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
}

export async function apiPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
}

export async function apiPut<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
}

export async function apiPatch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.patch(url, data, config);
  return response.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.delete(url, config);
  return response.data;
}

export default api;
