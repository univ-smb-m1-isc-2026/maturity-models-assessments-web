import axios from "axios";

import authHeader from "./auth-header.ts";

const API_URL = "http://localhost:8080/api/auth/";

const register = (firstName: string, lastName: string, email: string, password: string, roles: string[], token?: string) => {
  return axios.post(API_URL + "signup", {
    firstName,
    lastName,
    email,
    password,
    roles,
    token
  });
};

const login = (email: string, password: string, code?: string) => {
  return axios
    .post(API_URL + "signin", {
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
  return axios.post(API_URL + "verify", {
    email,
    code
  });
};

const generate2FA = () => {
  return axios.post(API_URL + "2fa/generate", {}, { headers: authHeader() });
};

const enable2FA = (secret: string, code: string) => {
  return axios.post(API_URL + "2fa/enable", { secret, code }, { headers: authHeader() });
};

const disable2FA = () => {
  return axios.post(API_URL + "2fa/disable", {}, { headers: authHeader() });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  verify,
  generate2FA,
  enable2FA,
  disable2FA,
};

export default AuthService;
