import axios from "axios";
import { DiagnosisTypes } from "../types";

import { apiBaseUrl } from "../constants";

const getAllDiagnoses = async () => {
  const { data } = await axios.get<DiagnosisTypes[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

export default {
  getAllDiagnoses,
};
