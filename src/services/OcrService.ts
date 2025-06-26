import axios from 'axios';

const API_URL = 'http://localhost:8089/api/ocr';  // Adjust with your backend URL

export const OcrService = {
    // Upload CV and get parsed data
    uploadCvs: async (formData: FormData) => {
        try {
          const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data;  // Return the response from the backend (e.g., OCR processed data)
        } catch (error) {
          console.error('Error uploading file', error);
          throw error;
        }
      },

    };

export default OcrService; // Exporting cvService as the default export