import axios from "axios";
import authHeader from "./auth-header";
import { IAssessment } from "../types/assessment.type";

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

  updateAssessment(id: string, assessment: IAssessment) {
    return axios.put<IAssessment>(API_URL + id, assessment, {
      headers: authHeader(),
    });
  }
}

export default new AssessmentService();
