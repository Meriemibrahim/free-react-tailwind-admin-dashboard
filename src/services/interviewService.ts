import axios from "axios";

const API_BASE_URL = "http://localhost:8089/api/interviews"; // Update if needed
export interface InterviewCalendarDTO {
  id: number;
  title: string;
  start: string;
  end: string;
  calendar: string;
  jobId: number;
  jobTitle: string;
  cvId: number;
  candidateEmail: string;
}

export const interviewService = {
 getAllInterviews: async (): Promise<InterviewCalendarDTO[]> => {    const response = await axios.get(`${API_BASE_URL}/calendar`);
    return response.data;
  },
  
getCandidatesByJob: async (selectedJobForInterview: any): Promise<InterviewCalendarDTO[]> => {    const response = await axios.get(`${API_BASE_URL}/calendar`);
    return response.data;
  },
   
    update: async (id: number, InterviewCalendarDTO: any): Promise<any> => {
      try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, InterviewCalendarDTO);
        return response.data;
      } catch (error) {
        console.error('Error updating job:', error);
        throw new Error('An error occurred while updating the job');
      }
    },
  createInterview: async (interviewData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}`, interviewData);
      return response.data;
    } catch (error) {
      console.error("Error creating interview", error);
      throw error;
    }
  },
};
// src/services/interviewService.ts

