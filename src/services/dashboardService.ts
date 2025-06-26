import axios from "axios";

const API_BASE_URL = "http://localhost:8089/api/dashboard"; // Update if needed
// src/services/dashboardService.ts


export const dashboardService = {
  getMetrics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/metrics`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des métriques :", error);
     
    }
  },
    getTopSkills: async (): Promise<{ skillName: string; candidateCount: number }[]> => {
    const response = await axios.get(`${API_BASE_URL}/top-skills`);
    return response.data;
  },
   getInterviewsPerMonth: async (): Promise<number[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/interviews-per-month`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des données des entretiens par mois", error);
      throw error;
    }
  },
   getJobsPerMonth: async (): Promise<Record<string, number>> => {
    const response = await axios.get(`${API_BASE_URL}/jobs-per-month`);
    return response.data; // Exemple attendu : { Jan: 3, Feb: 7, ... }
  },
  getInterviewsPerOffer: async (): Promise<{ title: string; count: number }[]> => {
  const response = await axios.get(`${API_BASE_URL}/interviews-per-offer`);
  return response.data;
},
  getPreselectionPercent: async (): Promise<number> => {
    const response = await axios.get<number>(`${API_BASE_URL}/preselection-percent`);
    return response.data;
  }
};

// src/services/interviewService.ts

