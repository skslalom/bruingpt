import { createContext, useContext } from 'react';

export interface UserInfo {
  userId: string;
  accessToken: string;
  email: string;
  groups: string[];
}

interface UserInfoContextType {
  userInfo: UserInfo | undefined;
  updateUserInfo: (newValue: UserInfo | undefined) => void;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export function useUserInfoContext() {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

export default UserInfoContext;
