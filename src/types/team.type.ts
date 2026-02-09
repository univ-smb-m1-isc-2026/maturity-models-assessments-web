import { IUser } from "./user.type";

export interface ITeamMember extends IUser {

  joinedAt?: string;
}

export interface ITeam {
  id: string;
  name: string;
  description?: string;
  owner: IUser;
  members: ITeamMember[];
}
