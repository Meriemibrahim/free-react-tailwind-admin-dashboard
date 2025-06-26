import axios from 'axios';
import { Certification } from '../../types/certification'; // define or adjust the type based on your model

const API_URL = 'http://localhost:8089/api/certifications';

export const certificationService = {
  getAll: async (): Promise<Certification[]> => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  },

  create: async (certification: Certification): Promise<Certification> => {
    const response = await axios.post(`${API_URL}`, certification);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
  
  affectToCv: async (cvId: number, certId: number): Promise<void> => {
    await axios.post(`${API_URL}/cv/${cvId}/add/${certId}`);
  },

  unaffectFromCv: async (cvId: number, certId: number): Promise<void> => {
    await axios.delete(`${API_URL}/cv/${cvId}/remove/${certId}`);
  },
  update: async (id: number, cert: Partial<Certification>): Promise<Certification> => {
  const response = await axios.put(`${API_URL}/${id}`, cert);
  return response.data;
}
};
