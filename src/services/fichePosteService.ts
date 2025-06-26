import axios from "axios";
import { Job } from "../../types/Job";

const API_URL = "http://localhost:8089/api/fiches"; // ton endpoint backend

export const fichePosteService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (ficheData: any) => {
    const response = await axios.post(API_URL, ficheData);
    return response.data;
  },

  update: async (id: number, updatedData: any) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  },
   
  getOffresByFichePosteId:async(fichePosteId: number) : Promise<Job[]> => {

    try {
  const response = await axios.get(`${API_URL}/${fichePosteId}/offres`);
      // Check if response.data is an array, if not return an empty array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Return an empty array if there's an error
      return [];
    }
},
};
