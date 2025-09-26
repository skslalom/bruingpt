import { useUserInfoContext } from '../../lib/contexts/UserInfoContext';
import { useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Outlet } from 'react-router';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export function Auth() {
  const { updateUserInfo } = useUserInfoContext();

  useEffect(() => {
    const hubListener = Hub.listen('auth', async ({ payload }) => {
      const { event } = payload;

      switch (event) {
        case 'signedOut': {
          console.debug('signed out');
          break;
        }
        case 'signedIn': {
          try {
            const sessionData = await fetchAuthSession();

            if (sessionData.tokens?.idToken) {
              const userInfo = {
                accessToken: sessionData.tokens?.idToken?.toString(),
                email: sessionData.tokens?.idToken?.payload.email as string,
                groups: sessionData.tokens?.idToken?.payload['cognito:groups'] as string[],
                userId: sessionData.tokens?.idToken?.payload['cognito:username'] as string,
              };

              updateUserInfo({ ...userInfo });
            }
          } catch (error) {
            console.error('Error setting up user: :', error);
          }
          break;
        }
      }
    });

    return () => {
      hubListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Authenticator>
      <Outlet />
    </Authenticator>
  );
}
