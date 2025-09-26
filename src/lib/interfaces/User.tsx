export interface User {
  lastName: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  firstName: string;
}

export interface UserColumn {
  id: 'email' | 'lastName' | 'updatedAt' | 'createdAt' | 'firstName';
  label: string;
  minWidth?: number;
  align?: 'left';
}
