export interface IUser {
  id?: any | null,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  roles?: string[],
  using2FA?: boolean,
  accessToken?: string
}
