import { signOut } from 'aws-amplify/auth';
import { jwtDecode } from 'jwt-decode';

export function checkValidToken(token: string): boolean {
  const decodedToken = jwtDecode(token);
  const exp = decodedToken.exp;

  if (!exp) {
    return false;
  }

  const expDate = new Date(exp * 1000);
  const now = new Date();
  if (now < expDate) {
    return true;
  } else return false;
}

export function logout() {
  localStorage.clear();
  signOut();
}

export function checkSessionExpired(token?: string) {
  if (!token || !checkValidToken(token)) {
    logout();
    alert('Your session has expired. Please refresh the page and log in again.');
    return true;
  } else return false;
}

/************************************************************************************
  Use this function to authenticate users with AWS Cognito with a custom login page
  using only email.
*************************************************************************************/
export async function loginViaEmail(email: string) {
  try {
    const response = await fetch('SetCognitoAPIUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (response.status !== 202) {
      await response.json();
      alert('User not registered. Please contact your admin and try again.');
      return false;
    } else {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    alert('Failed to login via email. Please try again.');
    return false;
  }
}
