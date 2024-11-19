import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export const register = async (userData: UserCreate) => {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
};

export const login = async (credentials: UserCreate) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  const token = response.data.access_token;
  
  if (token) {
    const expiryTime = new Date().getTime() + 30 * 60 * 1000;
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  }
  
  return response.data;
};

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  if (!token || !tokenExpiry) return false;
  
  return new Date().getTime() < parseInt(tokenExpiry);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
}; 