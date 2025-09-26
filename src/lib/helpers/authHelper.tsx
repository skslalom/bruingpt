import { IAccessCreds } from '../../App';

export const credentials = (creds: IAccessCreds) => {
  if (creds?.accessToken) {
    localStorage.setItem('credentials', JSON.stringify(creds));
    return true;
  }
  return false;
};
