import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance, setToken } from 'config';
import { toast } from 'react-toastify';

export const register = createAsyncThunk(
  'auth/register',
  async (body, { rejectWithValue }) => {
    try {
      const user = await instance.post('/api/auth/register', body);
      const normalizedData = {
        ...user.data,
        user: {
          ...user.data.user,
          userData: {
            ...user.data.user.userData,
            dailyRate: user.data.user.userData.dailyCalories,
          },
        },
      };
      
      return normalizedData;

    } catch (error) {
      toast.warn(
        error.response.status === 409
          ? 'Provided email already exists'
          : 'Bad request'
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
    // Reading the token from the state via getState()
    const state = thunkAPI.getState();
    const persistedToken = state.auth.refreshToken;
    const sid = { sid: state.auth.sid };
    if (persistedToken === null) {
      // If there is no token, exit without performing any request
      return thunkAPI.rejectWithValue('Unable to fetch user');
    }

    try {
      // If there is a token, add it to the HTTP header and perform the request
      setToken(persistedToken);
      const refresh = await instance.post('/api/auth/refresh', sid);
      setToken(refresh.data.newAccessToken);
      // const user = await instance.get('/user');
      // const payload = { refresh, user };
      return {
        ...refresh.data,
        user: {
          ...refresh.data.user,
          userData: {
            ...refresh.data.user.userData,
            dailyRate: Number(refresh.data.user.userData.dailyCalories) || 0,
          },
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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
    const user = await instance.get('/user');
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

