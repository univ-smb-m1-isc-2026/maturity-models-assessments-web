import { IUser } from "./user.type";

export interface ITeam {
    id: string;
    name: string;
    owner: IUser;
    members: IUser[];
}
