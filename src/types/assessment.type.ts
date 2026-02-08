import { ITeam } from "./team.type";
import { IMaturityModel } from "./maturity-model.type";

export interface IAnswer {
  questionText: string;
  selectedLevel: number;
  comment: string;
}

export interface ISubmission {
  userId: string;
  answers: IAnswer[];
  date: string;
}

export interface IAssessment {
  id: string;
  team: ITeam;
  maturityModel: IMaturityModel;
  date: string;
  submissions: ISubmission[];
}
