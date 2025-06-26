import axios from 'axios';
import { Skills } from '../../types/Skills';

const API_URL = 'http://localhost:8089/api/skills';  // Adjust with your backend URL

export const SkillService = {
    // Upload CV and get parsed data
   
    // Get all CVs
    getAllSkills: async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            return response.data;  // Return list of all CVs
        } catch (error) {
            console.error('Error fetching CVs:', error);
            throw error;
        }
    },

  
        // ✅ Create a skill
        createSkill: async (skill: Skills): Promise<Skills | null> => {
          try {
            const response = await axios.post(`${API_URL}`, skill);
            return response.data; // Return the created skill object from the response
          } catch (error) {
            console.error('Error creating skill:', error);
            return null; // Return null if there's an error
          }
        },
     
        affectToCv: async (cvId: number, skillId: number): Promise<void> => {
    await axios.post(`${API_URL}/affectToCv/${cvId}/${skillId}`);
  },

unaffectFromCv: async (cvId: number, skillId: number): Promise<void> => {
  await axios.delete(`${API_URL}/unaffectFromCv/${cvId}/${skillId}`);
},
updateSkill: async (skill: Skills) => {
  return axios.put(`${API_URL}/${skill.id}`, skill).then((res) => res.data);
},
  // ✅ Delete a CV
  deleteSkill: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
    
};

export default SkillService; // Exporting cvService as the default export