import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CvTable from "../../components/Cv/cvs";
import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests
import Button from "../../components/ui/button/Button";
import { FileIcon, PlusIcon } from "../../icons";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import AddCvForm from "../../components/Cv/Cv/AddCvForm";
export default function BasicTables() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isOpen, openModal, closeModal } = useModal();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };
const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1); // Incrémente pour rafraîchir
    setIsModalOpen(false); // Fermer modal
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully", response.data);
      setUploading(false);
      setUploading(false);
setIsModalOpen(false); // close modal
setRefreshKey(prev => prev + 1); // trigger refresh
    } catch (error) {
      console.error("Error uploading file", error);
      setUploading(false);
    }
  };
  
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Candidats" />

      <div className="space-y-6">
        <ComponentCard title="Liste Des Candidats">
<div className="mb-4 flex justify-between items-center">
  {/* Bouton à gauche */}
  <Button
    size="md"
    variant="primary"
    startIcon={<FileIcon className="size-5" />}
    onClick={() => setIsModalOpen(true)}
  >
    Télécharger des CVs
  </Button>

  {/* Bouton à droite */}
  <Button
    size="md"
    variant="primary"
    onClick={openModal}
  >
                      <span className="inline-block w-5 h-5 text-white-700 dark:text-white-400 font-bold select-none">+</span>

    Ajouter Candidat
  </Button>
</div>


<CvTable refreshKey={refreshKey} />
        </ComponentCard>
      </div>

      {/* Modal for Dropzone */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full relative">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <DropzoneComponent onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      )}
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <AddCvForm closeModal={closeModal} />
      </Modal>

    </>
  );
}
