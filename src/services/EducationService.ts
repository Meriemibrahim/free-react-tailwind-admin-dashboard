import axios from 'axios';
import { Education } from '../../types/Education'; // Define this type based on your backend model

const API_URL = 'http://localhost:8089/api/education';

export const educationService = {
  getAll: async (): Promise<Education[]> => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  },

  create: async (education: Education): Promise<Education> => {
    const response = await axios.post(`${API_URL}`, education);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
    updateCv: async (id: number, cvDetails: any) => {
      try {
        const response = await axios.put(`${API_URL}/${id}`, cvDetails);
        return response.data;
      } catch (error) {
        console.error('Error updating CV:', error);
        throw error;
      }
    },
     addEducationToCandidate: async (candidateId: number, education: Education): Promise<Education> => {
    const response = await axios.post<Education>(
      `${API_URL}/candidates/${candidateId}/educations`,
      education
    );
    return response.data;
  },

  // Supprimer une formation d'un candidat
  deleteEducationFromCandidate: async (candidateId: number, educationId: number): Promise<void> => {
    await axios.delete(`${API_URL}/candidates/${candidateId}/educations/${educationId}`);
  },
};
