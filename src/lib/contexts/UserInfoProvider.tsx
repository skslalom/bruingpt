import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { checkValidToken } from '../api/Auth';

type DecodedTokenCognito = JwtPayload & {
  email: string;
  'cognito:groups': string[];
};

import UserInfoContext, { UserInfo } from './UserInfoContext';

export function UserInfoContextProvider() {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    // check if userInfo is in localStorage (i.e. user is already signed in and their token isn't expired)
    const lastAuthUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${
        import.meta.env.VITE_REACT_APP_USER_POOL_APP_CLIENT_ID
      }.LastAuthUser`
    );

    if (lastAuthUser) {
      const accessToken = localStorage.getItem(
        `CognitoIdentityServiceProvider.${
          import.meta.env.VITE_REACT_APP_USER_POOL_APP_CLIENT_ID
        }.${lastAuthUser}.idToken`
      );

      if (accessToken && checkValidToken(accessToken)) {
        const decodedToken: DecodedTokenCognito = jwtDecode(accessToken);
        const email = decodedToken['email'];
        const userId = decodedToken['sub'] ?? '';
        const groups = decodedToken['cognito:groups'];
        setUserInfo({ userId, accessToken, email, groups });
      }
    }
    setRender(true);
  }, []);

  const updateUserInfo = (newValue: UserInfo | undefined) => {
    setUserInfo(newValue);
  };

  return (
    <UserInfoContext.Provider value={{ userInfo, updateUserInfo }}>
      {render && <Outlet />}
    </UserInfoContext.Provider>
  );
}
