import React, { useState } from "react";
import { useNavigate } from "react-router";
import { cvService } from "../../../services";

interface MatchResultsTableProps {
  matchResults: any[];
  jobId: number | null;
}

const MatchResultsTable: React.FC<MatchResultsTableProps> = ({ matchResults, jobId }) => {
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState<number | null>(null);
  const [interviewDate, setInterviewDate] = useState<string>("");
  const [candidateEmail, setCandidateEmail] = useState<string>("");
  const [preselectedCandidates, setPreselectedCandidates] = useState<any[]>([]); // Store preselected candidates

  // Handle view profile navigation
  const handleViewProfile = (cvId: number) => {
    navigate(`/cv-profile/${cvId}`);
  };

  const handleAccept = async (cvId: number) => {
    setSelectedCvId(cvId);
  
    try {
      const cv = await cvService.getCvById(cvId);  // Assuming this returns the full CV object
  
      // Assuming cv.candidates is an array and you want the first candidate's email
     
        setCandidateEmail(cv.emails[0]); // Assuming each candidate has an 'email' field
     
  
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching CV:", error);
      // Optionally handle errors such as displaying an alert or message
    }
  };
  

  const handleSubmit = async () => {
    // Ensure all necessary values are available
    if (!selectedCvId || !interviewDate || !candidateEmail|| !jobId) {
      console.error("Please fill in all the required fields.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("candidateId", selectedCvId.toString());
      
      formData.append("jobId", jobId.toString());
      formData.append("interviewDate", interviewDate);
      // Prepare data for submission
 
  
      // Send data to the backend
      const response = await fetch('http://localhost:8089/api/preselection/accept-candidate', {
        method: "POST",
        body: formData,

      });
      setIsModalOpen(false);
      setInterviewDate("");
      setCandidateEmail("");
      // Check if the response was successful
      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        
        // Simulate adding the candidate to the preselected candidates table
        // Ideally, you'd update the state to reflect the new preselected candidate
        setPreselectedCandidates((prev) => [
          ...prev,
          { candidateId: selectedCvId, interviewDate, candidateEmail }
        ]);
  
        // Close the modal
        setIsModalOpen(false);
        setInterviewDate("");
        setCandidateEmail("");
      } else {
        console.error("Failed to submit form:", await response.text());
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };
  

  



  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="space-y-5 sm:space-y-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-white">CV Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-white">Match Score</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-white">Fit</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matchResults.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{result.name}</td>
                  <td className="px-6 py-3 text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${parseFloat(result.match_score)}%` }}
                      />
                    </div>
                    {result.match_score}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {parseFloat(result.match_score) >= 80 ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full">High Fit</span>
                    ) : parseFloat(result.match_score) >= 50 ? (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">Medium Fit</span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full">Low Fit</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleViewProfile(result.cvId)}
                        disabled={!result.cvId}
                        className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium shadow-theme-xs
                          ${!result.cvId
                          ? 'cursor-not-allowed bg-gray-200 text-gray-400 border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-200'
                        }`}
                      >
                        Show
                      </button>

                      <button
                        onClick={() => handleAccept(result.cvId)}
                        className="flex items-center justify-center gap-2 rounded-full border border-green-300 bg-green-100 px-4 py-3 text-sm font-medium text-green-700 shadow-theme-xs hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:bg-green-800 dark:text-green-400 dark:hover:bg-white/[0.03] dark:hover:text-green-200"
                      >
                        Accept
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Interview and Candidate Details */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Set Up Interview</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="interview-date" className="block text-sm font-medium text-gray-700">Interview Date</label>
                <input
                  id="interview-date"
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="candidate-email" className="block text-sm font-medium text-gray-700">Candidate Email</label>
                <input
                  id="candidate-email"
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchResultsTable;
