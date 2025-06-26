import { useEffect, useRef, useState } from "react";
import { jobService } from "../../../services";
import { Job } from "../../../../types/Job";
import MatchResultsTable from "./MatchResultsTable";
import { useNavigate } from "react-router-dom"; // Make sure this import is at the top
import { fichePosteService } from "../../../services/fichePosteService";

interface MatchResult {
  match_score: string;
  cv_id: number;
  cv_name: string;
  skills: string[];
  education: string;
  experience: string;
  recommendation: string;
}
interface ThreeColumnJobGridProps {
  jobId?: number | null;
}
export default function ThreeColumnJobGrid({ jobId = null }: ThreeColumnJobGridProps) {
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchingJobId, setMatchingJobId] = useState<number | null>(null);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const navigate = useNavigate(); // Inside your component

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAll();
        if (Array.isArray(data)) {
          if (jobId !== 0 && jobId !== null) {
           const filteredJobs = await fichePosteService.getOffresByFichePosteId(jobId);
            setJobs(filteredJobs);
          } else {
            setJobs(data);
          }
        } else {
          setError("Failed to load jobs: data is not an array.");
        }
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching jobs.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobId]);



  useEffect(() => {
    if (filter === "all") {
      setFilteredResults(matchResults);
    } else if (filter === "high") {
      setFilteredResults(matchResults.filter(res => parseFloat(res.match_score) >= 80));
    } else if (filter === "medium") {
      setFilteredResults(
        matchResults.filter(res => parseFloat(res.match_score) >= 50 && parseFloat(res.match_score) < 80)
      );
    } else if (filter === "low") {
      setFilteredResults(matchResults.filter(res => parseFloat(res.match_score) < 50));
    }
  }, [filter, matchResults]);

  const handleMatchAllClick = async (jobId: number) => {
    setSelectedJobId(jobId);
    try {
      const response = await jobService.matchAllCVs(jobId);
      const sorted = response.sort((a: any, b: any) => parseFloat(b.match_score) - parseFloat(a.match_score));
      setMatchResults(sorted);
    } catch (error) {
      console.error("Error matching CVs:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-500 font-medium">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold mt-10">{error}</div>;
  }

  if (jobs.length === 0) {
    return <div className="text-center text-gray-500 font-medium mt-10">No job posts available at the moment.</div>;
  }

  return (
<div className="p-6">
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
    {jobs.map((job) => (
      <div
        key={job.id}
        className="border border-gray-200 rounded-xl dark:border-gray-800 p-6 shadow-md bg-white dark:bg-gray-900 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => navigate(`/jobs/${job.id}`)}
      >
        {/* Job Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{job.title}</h2>

        {/* Job Info */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <span role="img" aria-label="location">📍</span>
            {job.location}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <span role="img" aria-label="education">🎓</span>
            {job.educationLevel}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <span role="img" aria-label="experience">🧑‍💼</span>
            {job.minExperienceYears}+ years
          </p>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span role="img" aria-label="skills">🛠️</span>
            Skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills?.map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span role="img" aria-label="certifications">📜</span>
            Required Certifications:
          </p>
          <div className="flex flex-wrap gap-2">
            {job.requiredCertifications?.map((cert, index) => (
              <span
                key={index}
                className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300"
              >
                {cert.name}
              </span>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 line-clamp-3 flex items-center gap-2">
          <span role="img" aria-label="description">📝</span>
          {job.description}
        </p>
      </div>
    ))}
  </div>
</div>

  

     
  );
}
