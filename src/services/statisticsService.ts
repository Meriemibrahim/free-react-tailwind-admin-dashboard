// src/services/statisticsService.ts
import axios from "axios";

const API_BASE = "http://localhost:8089/api/statistics";

export const statisticsService = {
  getTotalCvs: () => axios.get<number>(`${API_BASE}/total-cvs`).then(res => res.data),
  getTopSkills: (topN = 10) => axios.get(`${API_BASE}/top-skills?topN=${topN}`).then(res => res.data),
  getStatusDistribution: () => axios.get(`${API_BASE}/status-distribution`).then(res => res.data),
  getGenderDistribution: () => axios.get(`${API_BASE}/gender-distribution`).then(res => res.data),
  getNationalityDistribution: () => axios.get(`${API_BASE}/nationality-distribution`).then(res => res.data),
  getAverageExperience: () => axios.get<number>(`${API_BASE}/average-experience`).then(res => res.data),
};
