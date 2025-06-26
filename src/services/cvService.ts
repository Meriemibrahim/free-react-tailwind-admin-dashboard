import axios from 'axios';

const API_URL = 'http://localhost:8089/cv';  // Adjust with your backend URL

export const cvService = {
    // Upload CV and get parsed data
   
    // Get all CVs
    getAllCvs: async () => {
        try {
            const response = await axios.get(`${API_URL}/all`);
            return response.data;  // Return list of all CVs
        } catch (error) {
            console.error('Error fetching CVs:', error);
            throw error;
        }
    },

    // Filter CVs
    filterCvs: async (skill?: string, minAge?: number, nationality?: string) => {
        try {
            const response = await axios.get(`${API_URL}/filter`, {
                params: { skill, minAge, nationality },
            });
            return response.data;  // Return filtered list of CVs
        } catch (error) {
            console.error('Error filtering CVs:', error);
            throw error;
        }
    },
    // ✅ Get a single CV by ID
    getCvById: async (id: number) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);  // API endpoint to get a CV by ID
            return response.data;  // Return the CV data
        } catch (error) {
            console.error('Error fetching CV by ID:', error);
            throw error;
        }
    },
    // Compare two CVs
    compareCvs: async (cvIds: number[]) => {
        try {
            const response = await axios.post(`${API_URL}/compare`, cvIds);
            return response.data;  // Return comparison result (true/false)
        } catch (error) {
            console.error('Error comparing CVs:', error);
            throw error;
        }
    },

     // ✅ Update CV
  updateCv: async (id: number, formData: FormData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du CV :", error);
    throw error;
  }
},
createCvForm: async (formData: FormData) => {
  const res = await axios.post(`${API_URL}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
},


  // ✅ Delete a CV
  deleteCv: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw error;
    }
  }
    
};

export default cvService; // Exporting cvService as the default export