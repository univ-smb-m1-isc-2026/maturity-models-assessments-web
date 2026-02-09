import axios from "axios";
import authHeader from "./auth-header.ts";

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

const updateMemberRoles = (teamId: string, userId: string, roles: string[]) => {
  return axios.put(API_URL + `/${teamId}/members/${userId}/roles`, { roles }, { headers: authHeader() });
};

const TeamService = {
  getUserTeams,
  createTeam,
  inviteMember,
  updateMemberRoles,
};

export default TeamService;
