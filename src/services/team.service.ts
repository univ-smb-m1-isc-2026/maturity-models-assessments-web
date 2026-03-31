import axios from "axios";
import authHeader from "./auth-header.ts";

import { apiUrl } from "../config";

const getUserTeams = () => {
  return axios.get(apiUrl("/api/teams"), { headers: authHeader() });
};

const createTeam = (name: string) => {
  return axios.post(apiUrl("/api/teams"), { name }, { headers: authHeader() });
};

const inviteMember = (teamId: string, email: string) => {
  return axios.post(apiUrl(`/api/teams/${teamId}/invite`), { email }, { headers: authHeader() });
};

const updateMemberRoles = (teamId: string, userId: string, roles: string[]) => {
  return axios.put(apiUrl(`/api/teams/${teamId}/members/${userId}/roles`), { roles }, { headers: authHeader() });
};

const getInvitations = (teamId: string) => {
  return axios.get(apiUrl(`/api/teams/${teamId}/invitations`), { headers: authHeader() });
};

const acceptInvitation = (token: string) => {
  return axios.post(apiUrl(`/api/teams/invitations/${token}/accept`), {}, { headers: authHeader() });
};

const resendInvitation = (teamId: string, invitationId: string) => {
  return axios.post(apiUrl(`/api/teams/${teamId}/invitations/${invitationId}/resend`), {}, { headers: authHeader() });
};

const revokeInvitation = (teamId: string, invitationId: string) => {
  return axios.post(apiUrl(`/api/teams/${teamId}/invitations/${invitationId}/revoke`), {}, { headers: authHeader() });
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
