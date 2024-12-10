// src/api/api.ts

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:9000/v1';

const api = axios.create({
  baseURL: BASE_URL,
});


const commonHeaders = () => {
  const token = Cookies.get('accessToken');
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiRequest = async (method: string, url: string, data: any = null) => {
  try {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : commonHeaders();
    
    const response = await api({
      method,
      url,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const login = async (credentials: { userIdentifier: string; password: string }) => {
  return await apiRequest('POST', '/auth/login', credentials);
};

export const register = async (userData: { username: string; email: string; password: string }) => {
  return await apiRequest('POST', '/auth/register', userData);
};

export const uploadFiles = async (formData: FormData) => {
  try {
    await apiRequest('POST', '/file/upload', formData);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  return await apiRequest('GET', '/auth/profile');
};
