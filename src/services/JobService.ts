import axios from 'axios';
import { Job } from '../../types/Job'; // Adjust based on your actual Job entity fields

const API_URL = 'http://localhost:8089/api/job-requirements';

export const jobService = {
  getAll: async (): Promise<Job[]> => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      // Check if response.data is an array, if not return an empty array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Return an empty array if there's an error
      return [];
    }
  },

  create: async (job: Job): Promise<Job> => {
    const response = await axios.post(`${API_URL}`, job);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
  
  // Upload file + Job entity for matching
  matchJobWithCv: async (cvFile: File, job: Job) => {
    try {
      const formData = new FormData();
      formData.append('file', cvFile);
      
      if (job && typeof job === 'object') {
        // Log the job object to inspect
        console.log("Job object to append:", job);
        
        // Serialize the job object to a JSON string before appending
        formData.append('job', JSON.stringify(job));
      } else {
        // If job is not a valid object, throw an error
        throw new Error('The job object is invalid.');
      }
      const response = await axios.post(`${API_URL}/match`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // This should be your match result, e.g., score, or parsed text
    } catch (error) {
      console.error("Error matching CV with job:");
      throw new Error("An error occurred while matching CV with job");
    }
  },
  update: async (id: number, job: Job): Promise<Job> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, job);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw new Error('An error occurred while updating the job');
    }
  },

  // Get a specific job by ID
  getById: async (id: number): Promise<Job | null> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data || null; // Return null if no data is found
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw new Error('An error occurred while fetching the job');
    }
  },
  getPreselectedCandidates: async (jobId: number) => {
    try {
      const response = await axios.get(`${API_URL}/${jobId}/preselected`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch preselected candidates:", error);
      throw error;
    }
  },

  matchAllCVs: async (id: number) => {
    try {
      
      

      const response = await axios.get(`${API_URL}/job/${id}`);

      return response.data; // This should be your match result, e.g., score, or parsed text
    } catch (error) {
      console.error("Error matching CV with job:");
      throw new Error("An error occurred while matching CV with job");
    }
  },
};
