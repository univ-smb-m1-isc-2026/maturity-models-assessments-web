import axios from "axios";
import authHeader from "./auth-header.ts";
import { IMaturityModel } from "../types/maturity-model.type.ts";

const API_URL = "http://localhost:8080/api/models";

const getAllModels = () => {
  return axios.get<IMaturityModel[]>(API_URL, { headers: authHeader() });
};

const getModelsByTeam = (teamId: string) => {
  return axios.get<IMaturityModel[]>(API_URL + `/team/${teamId}`, { headers: authHeader() });
};

const getModelById = (id: string) => {
  return axios.get<IMaturityModel>(API_URL + `/${id}`, { headers: authHeader() });
};

const createModel = (data: IMaturityModel) => {
  return axios.post<IMaturityModel>(API_URL, data, { headers: authHeader() });
};

const updateModel = (id: string, data: IMaturityModel) => {
  return axios.put<IMaturityModel>(API_URL + `/${id}`, data, { headers: authHeader() });
};

const deleteModel = (id: string) => {
  return axios.delete(API_URL + `/${id}`, { headers: authHeader() });
};

const MaturityModelService = {
  getAllModels,
  getModelsByTeam,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
};

export default MaturityModelService;
