export interface ILevel {
  value: number;
  description: string;
}

export interface IQuestion {
  text: string;
  levels: ILevel[];
}

export interface IMaturityModel {
  id?: string;
  name: string;
  questions: IQuestion[];
}
