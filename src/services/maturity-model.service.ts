import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/models";

const getAllModels = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getModelById = (id: string) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() });
};

const createModel = (data: any) => {
  return axios.post(API_URL, data, { headers: authHeader() });
};

const updateModel = (id: string, data: any) => {
  return axios.put(API_URL + `/${id}`, data, { headers: authHeader() });
};

const deleteModel = (id: string) => {
  return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
};

const MaturityModelService = {
  getAllModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
};

export default MaturityModelService;
