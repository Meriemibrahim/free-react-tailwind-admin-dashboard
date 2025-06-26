import axios from 'axios';
import { Experience } from '../../types/Experience'; // Define this type according to your backend model

const API_URL = 'http://localhost:8089/api/experiences';

export const experienceService = {
  getAll: async (): Promise<Experience[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (experience: Experience): Promise<Experience> => {
    const response = await axios.post(API_URL, experience);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  } ,
  updateCv: async (id: number, cvDetails: any) => {
      try {
        const response = await axios.put(`${API_URL}/${id}`, cvDetails);
        return response.data;
      } catch (error) {
        console.error('Error updating CV:', error);
        throw error;
      }
    },
  addExperienceToCandidate: async (candidateId: number, experience: Experience): Promise<Experience> => {
    const response = await axios.post<Experience>(
      `${API_URL}/candidates/${candidateId}/experiences`,
      experience
    );
    return response.data;
  },
      // Supprimer une formation d'un candidat
      deleteExperienceFromCandidate: async (candidateId: number, experienceId: number): Promise<void> => {
        await axios.delete(`${API_URL}/candidates/${candidateId}/experiences/${experienceId}`);
      },
};
