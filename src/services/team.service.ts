import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/teams";

const getUserTeams = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const createTeam = (name: string) => {
  return axios.post(API_URL, { name }, { headers: authHeader() });
};

const inviteMember = (teamId: string, email: string) => {
  return axios.post(API_URL + `/${teamId}/invite`, { email }, { headers: authHeader() });
};

const TeamService = {
  getUserTeams,
  createTeam,
  inviteMember,
};

export default TeamService;
