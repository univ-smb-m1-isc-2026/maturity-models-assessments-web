import axios from "axios";
import authHeader from "./auth-header.ts";
import { IAssessment, IAnswer } from "../types/assessment.type.ts";

import { apiUrl } from "../config";

class AssessmentService {
  startAssessment(teamId: string, maturityModelId: string) {
    return axios.post<IAssessment>(
      apiUrl("/api/assessments/start"),
      { teamId, maturityModelId },
      { headers: authHeader() }
    );
  }

  getTeamAssessments(teamId: string) {
    return axios.get<IAssessment[]>(apiUrl(`/api/assessments/team/${teamId}`), {
      headers: authHeader(),
    });
  }

  getAssessment(id: string) {
    return axios.get<IAssessment>(apiUrl(`/api/assessments/${id}`), { headers: authHeader() });
  }

  submitAssessment(id: string, answers: IAnswer[]) {
    return axios.put<IAssessment>(apiUrl(`/api/assessments/${id}/submit`), answers, {
      headers: authHeader(),
    });
  }
}

export default new AssessmentService();
