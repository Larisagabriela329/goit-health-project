import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance, setToken } from 'config';
import { toast } from 'react-toastify';

export const register = createAsyncThunk(
  'auth/register',
  async (body, { rejectWithValue }) => {
    try {
      const user = await instance.post('/api/auth/register', body);
      return user.data; 
    } catch (error) {
      toast.warn(
        error?.response?.status === 409
          ? 'Provided email already exists'
          : 'Something went wrong. Please try again.'
      );
      return rejectWithValue(error.message);
    }
  }
);


export const logIn = createAsyncThunk(
  'auth/login',
  async (body, { rejectWithValue }) => {
    try {
      const response = await instance.post('/api/auth/login', body);
      console.log('Login response:', response.data);

      const { accessToken, refreshToken } = response.data;
      setToken(accessToken);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      toast.success('Login successful');

      // Return only what the backend gives you
      return {
        accessToken,
        refreshToken,
        user: {
          userData: {
            dailyRate: null,
            notAllowedProducts: [],
          },
        },
      };
    } catch (error) {
      toast.warn(
        error?.response?.status === 403
          ? "Email doesn't exist or password is wrong"
          : 'Bad request'
      );
      return rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken; 

      await instance.post('/api/auth/logout', { refreshToken }); 

      return;
    } catch (error) {
      console.error('Logout failed:', error);
      return rejectWithValue(error.message);
    }
  }
);


export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      
      return thunkAPI.rejectWithValue('Unable to refresh user: No refresh token');
    }

    try {
      
      const response = await instance.post('/api/auth/refresh', { refreshToken });

      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      setToken(accessToken);

     

      return {
        accessToken,
        refreshToken: newRefreshToken,
       
      };
    } catch (error) {
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      return thunkAPI.rejectWithValue('Session expired, please log in again.');
    }
  }
);


export const getUser = createAsyncThunk('/api/auth/user', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.accessToken;

  if (persistedToken === null) {
    // If there is no token, exit without performing any request
    return thunkAPI.rejectWithValue('Unable to fetch user');
  }
  try {
    // If there is a token, add it to the HTTP header and perform the request
    setToken(persistedToken);
    const user = await instance.get('/api/auth/user');
    return user.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const dailyRate = createAsyncThunk(
  'auth/dailyRate',
  async (body, thunkAPI) => {
    try {
      const dailyrate = await instance.post('/api/daily-rate', body);
      console.log('🧪 API response:', dailyrate.data); // Add this
      return dailyrate.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

