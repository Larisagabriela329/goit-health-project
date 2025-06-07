import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost:3000',
});
export const setToken = token => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearToken = () => {
  instance.defaults.headers.common.Authorization = '';
};
