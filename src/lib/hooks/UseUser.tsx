import { UserInfo } from '../contexts/UserInfoContext';
import { User, UserColumn } from '../interfaces/User';
import { getUsers as getUsersApi } from '../api/User';

export const useUser = () => {
  const getUsers = async (userInfo?: UserInfo) => {
    const result = await getUsersApi(userInfo);
    if (result) {
      const users = result.map(user => {
        return formatUser(
          user.lastName,
          user.updatedAt,
          user.createdAt,
          user.email,
          user.firstName
        );
      });
      return users;
    }
    return result;
  };

  const columns: readonly UserColumn[] = [
    {
      id: 'email',
      label: 'Email',
      minWidth: 50,
    },
    {
      id: 'firstName',
      label: 'First Name',
      minWidth: 50,
    },
    { id: 'lastName', label: 'Last Name', minWidth: 50 },
    {
      id: 'createdAt',
      label: 'Date Created',
      minWidth: 50,
    },
    {
      id: 'updatedAt',
      label: 'Date Last Updated',
      minWidth: 50,
    },
  ];

  function formatUser(
    lastName: string,
    updatedAt: string,
    createdAt: string,
    email: string,
    firstName: string
  ): User {
    return {
      lastName,
      updatedAt,
      createdAt,
      email,
      firstName,
    };
  }

  return { getUsers, columns };
};
