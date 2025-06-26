import { useState, useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Experience } from "../../../../types/Experience";
import { experienceService } from "../../../services";
import DatePicker from "react-datepicker";
import { Cv } from "../../../../types/Cv";

type Props = {
   cv:Cv;
  experience: Experience;
  onUpdate: (updatedExperience: Experience) => void;
  onDelete: () => void; // ➕ AJOUTER CECI
};


export default function CvExperienceCard({ cv,experience,   onUpdate, onDelete }: Props) {
  const { isOpen, openModal, closeModal } = useModal();

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [errors, setErrors] = useState<{
  companyName?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}>({});

  useEffect(() => {
    if (isOpen) {
      setCompanyName(experience.companyName || "");
      setJobTitle(experience.jobTitle || "");
      setStartDate(experience.startDate || "");
      setEndDate(experience.endDate || "");
      setDescription(experience.description || "");
      setError(null);
    }
  }, [isOpen, experience]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
  const newErrors: typeof errors = {};

  if (!companyName) newErrors.companyName = "L’entreprise  est requise.";
  if (!jobTitle) newErrors.jobTitle = "Le Poste  est requis.";
  if (!startDate) newErrors.startDate = "La date de début est requise.";

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    newErrors.endDate = "La date de fin doit être postérieure à la date de début.";
  }

 if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
    setLoading(true);
    setError(null);
const updatedData = {
  companyName: companyName.trim(),
  jobTitle: jobTitle.trim(),
  startDate: startDate.trim(),
  endDate: endDate.trim(),
  description: description.trim(),
};


    try {
      if (!experience.id) throw new Error("ID de l'expérience manquant");
      const updatedCv = await experienceService.updateCv(experience.id, updatedData);
      onUpdate(updatedCv);
      closeModal();
      // ✅ Appeler onUpdate pour mettre à jour le parent
      onUpdate({ ...experience, ...updatedData });

      closeModal();
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'expérience.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!cv.id) {
      console.error("cv ID manquant pour la suppression");
      return;
    }
  if (!experience.id) {
      console.error("education ID manquant pour la suppression");
      return;
    }
    try {
      setLoading(true);
    await experienceService.deleteExperienceFromCandidate(cv.id, experience.id); // ✅ appel API à supprimer
      onDelete(); // ✅ notifie le parent pour qu'il retire l'élément de la liste
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };
  return (
    <>
      {/* Bouton pour ouvrir la modal */}
      <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <div>
           
         
    <h4 className="text-lg font-semibold">{experience.jobTitle}</h4>
            <p className="text-sm text-gray-500">{experience.companyName}</p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Date De Debut</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{experience.startDate}</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Date de Fin</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{experience.endDate}</p>
              </div>
                   <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Description</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{experience.description}</p>
              </div>
              </div>
        
          </div>
      
<div className="flex flex-col gap-3">

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill="currentColor"
              />
            </svg>
            modifier
          </button>

  <button
    onClick={() => setShowDeleteConfirm(true)}
    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-theme-xs hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-300"
  >
    <svg
      className="fill-current"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6Z" />
    </svg>
    Supprimer
  </button>
  </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Modifier l'expérience
          </h4>
          <form onSubmit={handleSave} className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Entreprise</Label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
                {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}

              </div>

              <div>
                <Label>Poste</Label>
                <Input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  disabled={loading}
                />
                {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle}</p>}

              </div>


  <div>
    <Label>Date de début</Label>
    <DatePicker
      selected={startDate ? new Date(startDate) : null}
      onChange={(date: Date | null) =>
        setStartDate(date ? date.toISOString().split("T")[0] : "")
      }
      dateFormat="yyyy-MM-dd"
      placeholderText="Choisissez une date"
      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
      disabled={loading}
    />
    {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}

  </div>

  <div>
    <Label>Date de fin</Label>
    <DatePicker
      selected={endDate ? new Date(endDate) : null}
      onChange={(date: Date | null) =>
        setEndDate(date ? date.toISOString().split("T")[0] : "")
      }
      dateFormat="yyyy-MM-dd"
      placeholderText="Choisissez une date"
      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
      disabled={loading}
    />
    {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}

  </div>


              <div className="lg:col-span-2">
                <Label>Description</Label>
                <textarea
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex items-center gap-3 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={loading}>
                Fermer
              </Button>
              <Button size="sm" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
       <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} className="max-w-md">
  <div className="p-6 text-center">
    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
      Confirmation de suppression
    </h3>
    <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
      Es-tu sûr de vouloir supprimer cette experience ? Cette action est irréversible.
    </p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => setShowDeleteConfirm(false)}
        className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
      >
        Annuler
      </button>
      <button
        onClick={handleDelete} // ✅ appel correct ici
        className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
      >
        Confirmer
      </button>
    </div>
  </div>
</Modal>

    </>
  );
}
