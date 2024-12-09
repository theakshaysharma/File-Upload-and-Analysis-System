import axios from 'axios';
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

export const apiRequest = async (
  method: string,
  url: string,
  data: any = null,
) => {
  try {
    const token = Cookies.get('accessToken');
    const headers = {
      ...(data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : commonHeaders()),
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config: any = {
      method,
      url,
      headers,
    };

    // Include data only if it's not null and the method isn't DELETE
    if (data && method !== 'DELETE') {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const login = async (credentials: {
  userIdentifier: string;
  password: string;
}) => {
  return await apiRequest('POST', '/auth/login', credentials);
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
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
  return await apiRequest('GET', '/user/profile');
};

// Update user profile (First name and Last name)
export const updateUserProfile = async (
  firstName: string,
  lastName: string,
) => {
  const data = { firstName, lastName };
  return await apiRequest('PUT', '/user/profile', data);
};

// Get all users (for admin/owner)
export const getUsers = async () => {
  return await apiRequest('GET', '/user/all');
};

// Update user role to 'admin' (Admin/Owner can promote users)
export const updateUserRole = async (userId: number, role: string) => {
  const data = { role };
  return await apiRequest('PUT', `/user/role/${userId}`, data);
};

// Delete user (Admin/Owner can delete users)
export const deleteUser = async (userId: number) => {
  return await apiRequest('DELETE', `/user/${userId}`);
};
