import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { jobService } from "../../services";
import JobDetails from "../../components/Job/job/JobDetails";
import  { JobEditModal } from "../../components/Job/job/JobEditModal";
import MatchResultsTable from "../../components/Job/job/MatchResultsTable";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { BoxIcon, DownloadIcon, PlusIcon } from "../../icons";
import PreselectedCandidatesTable from "../../components/Job/PreselectedCandidatesTable";


export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>(); // Type for id as string
  const [job, setJob] = useState<any>(null);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preselectedCandidates, setPreselectedCandidates] = useState<any[]>([]); // Store preselected candidates

  // Convert the id to a number, or return early if id is invalid
  const jobId = id ? parseInt(id, 10) : null;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (!jobId) {
      setIsLoading(false); // Ensure loading state is false if jobId is invalid
      return;
    }
    const fetchPreselectedCandidates = async (jobId: number) => {
      try {
        const response = await jobService.getPreselectedCandidates(jobId);
        setPreselectedCandidates(response);
      } catch (error) {
        console.error("Error fetching preselected candidates:", error);
      }
    };
    
    const fetchJobDetails = async () => {
      try {
        const jobDetails = await jobService.getById(jobId); // jobDetails might be null
        
        if (jobDetails) {
          if (jobDetails.id) { // Guard against null
            await fetchPreselectedCandidates(jobDetails.id);

            setJob(jobDetails);
            await handleMatchAllClick(jobDetails.id);
          } else {
            console.error("Job not found");
          }
        }
        setIsLoading(false); // Set loading state to false after fetching job details
      } catch (error) {
        console.error("Error fetching job details:", error);
        setIsLoading(false); // Ensure loading state is false if an error occurs
      }
    };

    fetchJobDetails();
  }, [jobId]); // Dependency on jobId, so it triggers when id changes

  const handleSave = async () => {
    if (job && jobId) {
      try {
        const updatedJob = await jobService.update(jobId, job); // Pass jobId here
        if (updatedJob.id) { // Check if updatedJob is valid
          setJob(updatedJob);
          await handleMatchAllClick(updatedJob.id);
        } else {
          console.error("Failed to update job");
        }
      } catch (error) {
        console.error("Error saving job details:", error);
      }
    }
    setEditModalOpen(false); // Close the modal after save
  };

  const handleMatchAllClick = async (jobId: number) => {
    try {
      const response = await jobService.matchAllCVs(jobId);

      
      const sorted = response.sort((a: any, b: any) => parseFloat(b.match_score) - parseFloat(a.match_score));
      setMatchResults(sorted);
    } catch (error) {
      console.error("Error matching CVs:", error);
    }
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found.</div>;
  }


  const handleMatchClick = () => {
    fileInputRef.current?.click();
  };

  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !job) return;
  
    const files = Array.from(e.target.files);
    
    setUploading(true); // Start loading
  
    try {
      const uploadPromises = files.map(async (file) => {
        const response = await jobService.matchJobWithCv(file, job);
        return response;
      });
  
      const newResults = await Promise.all(uploadPromises);
  
      setMatchResults((prevResults) => [
        ...prevResults,
        ...newResults.sort(
          (a, b) => parseFloat(b.match_score) - parseFloat(a.match_score)
        ),
      ]);
    } catch (error) {
      console.error("Failed to match CVs:", error);
    } finally {
      setUploading(false); // End loading whether success or error
    }
  };
  
  return (
    <div className="p-6">
   <input
  type="file"
  ref={fileInputRef}
  style={{ display: "none" }}
  accept=".pdf,.doc,.docx"
  multiple
  onChange={handleFileChange}
/>

    <PageMeta title="Create Job" description="" />
    <PageBreadcrumb pageTitle="Post" />
    <div className="p-6">
      <JobDetails job={job} onSave={handleSave} />
      <div className="p-6">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
         
      <PreselectedCandidatesTable candidates={preselectedCandidates} /> {/* Display preselected candidates */}
</div>
</div>
</div>
      <div className="p-6">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Candidat propositions               </h4>
            
            </div>
          

          <div className="flex items-center gap-2">

     <Button
              size="sm"
              variant="primary"
              startIcon={<DownloadIcon className="size-5" />}
              onClick={() => handleMatchClick()}


            >
Candidat          </Button>



</div>

</div>
      
{uploading ? (
  <div className="flex justify-center items-center p-6">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>
) : (
  matchResults.length > 0 && <MatchResultsTable matchResults={matchResults} jobId={job.id} />
)}
      </div>
      </div>
   
      <JobEditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        job={job}
        
      />
    </div>
    </div>
    
  );
}
