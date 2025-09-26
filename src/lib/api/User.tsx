import axios from 'axios';
import { API_URL } from '../constants';
import { UserInfo } from '../contexts/UserInfoContext';
import { GetUserRes } from '../models/User';
import { checkSessionExpired } from './Auth';

export async function getUsers(userInfo?: UserInfo): Promise<GetUserRes[] | undefined> {
  if (!checkSessionExpired(userInfo?.accessToken)) {
    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.accessToken}`,
      };
      const response = await axios.get(`${API_URL}users`, {
        headers,
      });

      return response.data;
    } catch (error) {
      return undefined;
    }
  } else return undefined;
}

export async function addUser(formData: any, userInfo?: UserInfo): Promise<any> {
  if (!checkSessionExpired(userInfo?.accessToken)) {
    return new Promise((resolve, reject) => {
      const requestBody = {
        users: [
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            clientId: formData.clientId,
          },
        ],
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
      };
      axios
        .post(`${API_URL}/users`, requestBody, config)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
      return 'success';
    });
  } else return undefined;
}

export async function updateUser(
  _formData: any,
  _userId: string,
  _userInfo?: UserInfo
): Promise<any> {
  console.log('Not implemented');
}
