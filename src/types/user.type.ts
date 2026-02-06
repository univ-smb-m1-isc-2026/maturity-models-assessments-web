export interface IUser {
  id?: any | null,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  roles?: string[],
  accessToken?: string
}
