import axios from "axios";

import authHeader from "./auth-header.ts";

import { apiUrl } from "../config";

const register = (firstName: string, lastName: string, email: string, password: string, teamId?: string) => {
  return axios.post(apiUrl("/api/auth/signup"), {
    firstName,
    lastName,
    email,
    password,
    teamId
  });
};

const login = (email: string, password: string, code?: string) => {
  return axios
    .post(apiUrl("/api/auth/signin"), {
      email,
      password,
      code
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

const verify = (email: string, code: string) => {
  return axios.post(apiUrl("/api/auth/verify"), {
    email,
    code
  });
};

const resendVerification = (email: string) => {
  return axios.post(apiUrl("/api/auth/verify/resend"), null, { params: { email } });
};

const generate2FA = () => {
  return axios.post(apiUrl("/api/auth/2fa/generate"), {}, { headers: authHeader() });
};

const enable2FA = (secret: string, code: string) => {
  return axios.post(apiUrl("/api/auth/2fa/enable"), { secret, code }, { headers: authHeader() });
};

const disable2FA = () => {
  return axios.post(apiUrl("/api/auth/2fa/disable"), {}, { headers: authHeader() });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  verify,
  resendVerification,
  generate2FA,
  enable2FA,
  disable2FA,
};

export default AuthService;
