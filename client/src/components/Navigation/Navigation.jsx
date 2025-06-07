// import { NavLink } from 'react-router-dom';
import { getIsLoggedIn } from '../../redux/auth/auth-selectors';
import UserInfo from '../UserInfo';
import { useSelector } from 'react-redux';
import {
  NavigationList,
  NavigationItem,
  NavItem,
  NavigationLogin,
  NavigationDiary,
  StyledUserInfo,
  NavigationListDiary,
  StyledDiv,
} from './Navigation.styled';
import { ThemeTogle } from 'pages/Login/ThemeTogle';
import { StyledWrapper } from './Navigation.styled';



function Navigation() {
  const isUserLogin = useSelector(getIsLoggedIn);

  console.log('isUserLogin:', isUserLogin);

  return (
    <StyledDiv>
      <nav>
      {!isUserLogin ? (
  <NavigationLogin>
    <NavigationList>
      <NavigationItem>
        <NavItem to="login">Login</NavItem>
      </NavigationItem>
      <NavigationItem>
        <NavItem to="registration">Register</NavItem>
      </NavigationItem>
      <NavigationItem>
        <StyledWrapper>
          <ThemeTogle />
        </StyledWrapper>
      </NavigationItem>
    </NavigationList>
  </NavigationLogin>
) : (
  <NavigationDiary>
    <NavigationListDiary>
      <NavigationList>
        <NavigationItem>
          <NavItem to="diary">Diary</NavItem>
        </NavigationItem>
        <NavigationItem>
          <NavItem to="calculator">Calculator</NavItem>
        </NavigationItem>
        <NavigationItem>
          <ThemeTogle />
        </NavigationItem>
      </NavigationList>
    </NavigationListDiary>
    <StyledUserInfo>
      <UserInfo />
    </StyledUserInfo>
  </NavigationDiary>
)}
      </nav>
    </StyledDiv>
  );
}
export default Navigation;
