import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUser, refreshUser } from '../redux/auth/auth-operations';
import { Route, Routes } from 'react-router-dom';
import { PublicRoute } from './PublicRoute'; // if in same folder
import { PrivateRoute } from './PrivateRoute'; // if in same folder
import { Layout } from './Layout/Layout'; // if Layout is in components/Layout
import 'react-toastify/dist/ReactToastify.css';
import { getIsRefreshing } from '../redux/auth/auth-selectors';
import { ThemeSwitching } from './styles/ThemeSwitching';
import { useAuth } from '../hooks';
import { dayInfo } from '../redux/day/day-operations';
import { GlobalStylesPrivate } from './styles/GlobalStylePrivate.styled';
import { GlobalStylePublic } from './GlobalStylePublic/GlobalStylePublic.styled';
import Loader from './Loader/Loader'; 
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Calculator from '../pages/Calculator';
import Diary from '../pages/Diary';
import PageNotFound from './PageNotFound/PageNotFound'; 
import { selectIsLoading } from '../redux/loader/loader-selectors';
import { setToken } from 'config';




export const App = () => {
  const { isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const normalizedSelectedDate = new Date().toISOString().split('T')[0];
  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;
  
    dispatch(refreshUser())
      .unwrap()
      .then(() => dispatch(getUser()))
      .then(() => dispatch(dayInfo({ date: normalizedSelectedDate })))
      .catch((err) => {
        console.warn('🔁 Refresh failed:', err);
      });
  }, [dispatch, normalizedSelectedDate]);
  

  const isRefreshing = useSelector(getIsRefreshing);

  const isLoading = useSelector(selectIsLoading);

  const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
  setToken(accessToken);
}

  return (
    <ThemeSwitching>
       {(isRefreshing || isLoading) && <Loader />}
      {isRefreshing ? (
        <Loader />
      ) : (
        <>
          {isLoggedIn ? <GlobalStylesPrivate /> : <GlobalStylePublic />}
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="/registration"
                element={
                  <PublicRoute restricted>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute restricted>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/calculator"
                element={
                  <PrivateRoute>
                    <Calculator />
                  </PrivateRoute>
                }
              />
              <Route
                path="/diary"
                element={
                  <PrivateRoute>
                    <Diary />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
          {/* </Suspense> */}
        </>
      )}
    </ThemeSwitching>
  );
};