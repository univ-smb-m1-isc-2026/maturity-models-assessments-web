export interface IUser {
  id?: any | null,
  username?: string | null,
  email?: string,
  password?: string,
  roles?: string[],
  accessToken?: string
}
