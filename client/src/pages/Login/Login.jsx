import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../../redux/auth/auth-operations';
import { getIsLoggedIn } from '../../redux/auth/auth-selectors';
import { useEffect } from 'react';
import {
  StyledInputAuth,
  StyledFormAuth,
  StyledBtnAuthAccent,
  StyledHeaderAuth,
  StyledWrapInputAuth,
  StyledLabelAuth,
  StyledErrorAuth,
  // StyledLinkAuth,
  StyledWrapAuthBtn,
  AuthWrapComponent,
} from './Login.styled';
import { Formik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdAlert } from 'react-icons/io';
import GlobalTablet from 'components/GlobalStylePublic/GlobalTablet';

let schema = yup.object({
  password: yup
    .string()
    .required('Please enter a password')
    .min(8, 'Min length 8 symbols')
    .max(32, 'Max length 32 symbols')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, 'a-z and 0-9'),

  email: yup
    .string()
    .required('Please enter a email')
    .email('Enter a correct email')
    .min(8, 'Min length 8 symbols')
    .max(32, 'Max length 32 symbols'),
});

function Login() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);
const navigate = useNavigate();
  const startValue = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const action = await dispatch(logIn(values));
  
      // Check if login failed
      if (logIn.rejected.match(action)) {
        console.warn('Login failed:', action.payload);
        return;
      }
  
      // If successful, reset the form
      resetForm();
    } catch (error) {
      console.error('Unexpected error during login:', error.message);
    }
  };
  

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/diary'); // Or change this to "/calculator" if you want
    }
  }, [isLoggedIn, navigate]);
  
  return (
    <>
      <GlobalTablet />
      <AuthWrapComponent>
        <StyledHeaderAuth>Sign in</StyledHeaderAuth>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={schema}
          initialValues={startValue}
        >
          <StyledFormAuth>
            <StyledWrapInputAuth>
              <StyledInputAuth type="email" name="email" placeholder=" " />
              <StyledLabelAuth>Email *</StyledLabelAuth>
              <ErrorMessage name="email">
                {m => (
                  <StyledErrorAuth>
                    <IoMdAlert />
                    {m}
                  </StyledErrorAuth>
                )}
              </ErrorMessage>
            </StyledWrapInputAuth>
            <StyledWrapInputAuth>
              <StyledInputAuth
                type="password"
                name="password"
                placeholder=" "
              />
              <StyledLabelAuth>Password *</StyledLabelAuth>
              <ErrorMessage name="password">
                {m => (
                  <StyledErrorAuth>
                    <IoMdAlert />
                    {m}
                  </StyledErrorAuth>
                )}
              </ErrorMessage>
            </StyledWrapInputAuth>
            <StyledWrapAuthBtn>
              <StyledBtnAuthAccent type="submit">
                Sign in
              </StyledBtnAuthAccent>
              {/* <StyledLinkAuth to="/registration">Register</StyledLinkAuth> */}
            </StyledWrapAuthBtn>
          </StyledFormAuth>
        </Formik>
      </AuthWrapComponent>
    </>
  );
}

export default Login;
