export interface IUser {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  accessToken?: string;
}
