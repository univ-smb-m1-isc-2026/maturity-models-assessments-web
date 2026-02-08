import { IUser } from "./user.type";

export interface ITeamMember extends IUser {
  // Add any specific properties for team members if needed
}

export interface ITeam {
  id: string;
  name: string;
  description?: string;
  owner: IUser;
  members: ITeamMember[];
}
