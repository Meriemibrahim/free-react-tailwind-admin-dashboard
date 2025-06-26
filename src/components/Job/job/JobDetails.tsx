import { useState } from "react";
import { Job } from "../../../../types/Job";
import { useModal } from "../../../hooks/useModal";
import { JobEditModal } from "./JobEditModal"; // Import the modal here
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { jobService } from "../../../services";
import { useNavigate } from "react-router";

type Props = {
  job: Job;
  onSave: (updatedJob: Job) => void;
};

export default function JobDetailsCard({ job, onSave }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [editableJob, setEditableJob] = useState<Job>(job);
  const navigate = useNavigate();

  const handleSave = (updatedJob: Job) => {
    onSave(updatedJob);
    closeModal();
  };
  const handleDelete = async () => {
    if (job.id) {
      await jobService.delete(job.id); // Assuming you have a delete method
      closeModal(); // Close edit modal
      closeDeleteModal(); // Close delete modal
      navigate("/jobs"); 

      // You may want to refresh the page or update the parent list after deletion
    }
  };


  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false)
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Job Details
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Title
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {editableJob.title || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {editableJob.location || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Education
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {editableJob.educationLevel || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Experience
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {editableJob.minExperienceYears || "N/A"}
                </p>
              </div>

              <div className="lg:col-span-2">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Description
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {editableJob.description || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
  <button
    onClick={openModal}
    className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
  >
    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="currentColor" />
    </svg>
    Edit
  </button>

  <button
    onClick={openDeleteModal}
    className="flex items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-300"
  >
    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2h6v1H6V2Zm2 2h2v1h-2V4Zm5 2v8c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6H3v2h1v8c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V8h1V6h-2Z" fill="currentColor" />
    </svg>
    Delete
  </button>
</div>

        </div>
      </div>

      {/* The modal edit component is now in a separate file */}
      <JobEditModal
        job={editableJob}
        isOpen={isOpen}
        onClose={closeModal}
        onSave={handleSave}
      />
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
  <div className="p-6 space-y-4">
    <h2 className="text-lg font-semibold text-red-600">Confirm Deletion</h2>
    <p>Are you sure you want to delete this job? This action cannot be undone.</p>
    <div className="flex justify-end gap-4">
      <Button onClick={closeDeleteModal} >Cancel</Button>
      <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
    </div>
  </div>
</Modal>

    </>
  );
}
