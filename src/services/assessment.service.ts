import axios from "axios";
<<<<<<< Updated upstream
import authHeader from "./auth-header.ts";
import { IAssessment, IAnswer } from "../types/assessment.type.ts";
=======
import authHeader from "./auth-header";
import { IAssessment, IAnswer } from "../types/assessment.type";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

const API_URL = "http://localhost:8080/api/assessments/";

class AssessmentService {
  startAssessment(teamId: string, maturityModelId: string) {
    return axios.post<IAssessment>(
      API_URL + "start",
      { teamId, maturityModelId },
      { headers: authHeader() }
    );
  }

  getTeamAssessments(teamId: string) {
    return axios.get<IAssessment[]>(API_URL + "team/" + teamId, {
      headers: authHeader(),
    });
  }

  getAssessment(id: string) {
    return axios.get<IAssessment>(API_URL + id, { headers: authHeader() });
  }

  submitAssessment(id: string, answers: IAnswer[]) {
    return axios.put<IAssessment>(API_URL + id + "/submit", answers, {
      headers: authHeader(),
    });
  }
}

export default new AssessmentService();
