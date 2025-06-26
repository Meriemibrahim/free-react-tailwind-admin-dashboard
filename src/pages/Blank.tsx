import { useEffect, useState } from "react";

type Job = {
  id: number;
  title: string;
  educationLevel: string;
  minExperienceYears: number;
};

export default function ThreeColumnJobGrid() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job data.");
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-500 font-medium">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 font-medium mt-10">
        No job posts available at the moment.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border border-gray-200 rounded-xl dark:border-gray-800 p-4 shadow-md bg-white dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {job.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Education: {job.educationLevel}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Experience: {job.minExperienceYears}+ years
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
