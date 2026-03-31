import axios from "axios";
import authHeader from "./auth-header.ts";
import { IMaturityModel } from "../types/maturity-model.type.ts";

import { apiUrl } from "../config";

const getAllModels = () => {
  return axios.get<IMaturityModel[]>(apiUrl("/api/models"), { headers: authHeader() });
};

const getModelsByTeam = (teamId: string) => {
  return axios.get<IMaturityModel[]>(apiUrl(`/api/models/team/${teamId}`), { headers: authHeader() });
};

const getModelById = (id: string) => {
  return axios.get<IMaturityModel>(apiUrl(`/api/models/${id}`), { headers: authHeader() });
};

const createModel = (data: IMaturityModel) => {
  return axios.post<IMaturityModel>(apiUrl("/api/models"), data, { headers: authHeader() });
};

const updateModel = (id: string, data: IMaturityModel) => {
  return axios.put<IMaturityModel>(apiUrl(`/api/models/${id}`), data, { headers: authHeader() });
};

const deleteModel = (id: string) => {
  return axios.delete(apiUrl(`/api/models/${id}`), { headers: authHeader() });
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
