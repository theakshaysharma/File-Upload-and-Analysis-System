import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9000/v1';

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
  onUploadProgress?: (progressEvent: ProgressEvent) => void
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
      ...(onUploadProgress && { onUploadProgress }),
    };

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

export const uploadFiles = async (
  formData: FormData,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  try {
    await apiRequest('POST', '/file/upload', formData, onUploadProgress);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  return await apiRequest('GET', '/user/profile');
};

export const getAllFiles = async () => {
  return await apiRequest('GET', '/file/all');
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
  return await apiRequest('GET', '/admin/all');
};

// Update user role to 'admin' (Admin/Owner can promote users)
export const updateUserRole = async (userId: number, role: string) => {
  const data = { role };
  return await apiRequest('PUT', `/admin/role/${userId}`, data);
};

// Delete user (Admin/Owner can delete users)
export const deleteUser = async (userId: number) => {
  return await apiRequest('DELETE', `/admin/${userId}`);
};

//Delete all data
export const clearAll = async () => {
  return await apiRequest('DELETE', `/admin/clear-all`);
};

// Get file details by ID
export const getFileDetails = async (fileId: number) => {
  try {
    const response = await apiRequest('GET', `/file/${fileId}`);
    console.log('from api.ts', response.data)
    return response;
  } catch (error) {
    console.error('Error fetching file details:', error);
    throw error;
  }
  
};

// Delete file by ID
export const deleteFileById = async (fileId: number) => {
  try {
    return await apiRequest('DELETE', `/file/${fileId}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

