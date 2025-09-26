import { ResourcesConfig } from 'aws-amplify';

// This is the newer configuration for Amplify generation 2 (aka version 6)
// NOTE: authFlowType defaults to "USER_SRP_AUTH" and doesn't need to be explicitly set
// NOTE: the Region is no longer a property of ResourcesConfig. It's inferred by userPoolId.
const amplifyconfiguration: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_REACT_APP_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_REACT_APP_USER_POOL_APP_CLIENT_ID,
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_APP_AUTH_DOMAIN,
          responseType: 'token',
          scopes: ['email', 'openid'],
          redirectSignIn: [import.meta.env.VITE_REACT_WEB_APP_URL],
          redirectSignOut: [import.meta.env.VITE_REACT_WEB_APP_URL],
        },
        email: true,
      },
    },
  },
};

export default amplifyconfiguration;
