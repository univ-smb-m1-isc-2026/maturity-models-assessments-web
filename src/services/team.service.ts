import axios from "axios";
import authHeader from "./auth-header.ts";

import { MMA_API_URL } from "../config";
const API_URL = MMA_API_URL + "/api/teams/";

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

const getInvitations = (teamId: string) => {
  return axios.get(API_URL + `/${teamId}/invitations`, { headers: authHeader() });
};

const acceptInvitation = (token: string) => {
  return axios.post(API_URL + `/invitations/${token}/accept`, {}, { headers: authHeader() });
};

const resendInvitation = (teamId: string, invitationId: string) => {
  return axios.post(API_URL + `/${teamId}/invitations/${invitationId}/resend`, {}, { headers: authHeader() });
};

const revokeInvitation = (teamId: string, invitationId: string) => {
  return axios.post(API_URL + `/${teamId}/invitations/${invitationId}/revoke`, {}, { headers: authHeader() });
};

const TeamService = {
  getUserTeams,
  createTeam,
  inviteMember,
  updateMemberRoles,
  getInvitations,
  acceptInvitation,
  resendInvitation,
  revokeInvitation,
};

export default TeamService;
