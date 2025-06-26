import { useState, useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Education } from "../../../../types/Education";
import { educationService } from "../../../services";
import DatePicker from "react-datepicker";
import { Cv } from "../../../../types/Cv";

type Props = {
  cv:Cv;
  education: Education;
  onUpdate: (updatedEducation: Education) => void;
  onDelete: () => void; // ✅ Ajout obligatoire ici
};

export default function CvEducationCard({ cv,education, onUpdate, onDelete }: Props) {
  const { isOpen, openModal, closeModal } = useModal();

  const [institution, setinstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setfieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [errors, setErrors] = useState<{
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}>({});

  useEffect(() => {
    if (isOpen) {
      setinstitution(education.institution || "");
      setDegree(education.degree || "");
      setfieldOfStudy(education.fieldOfStudy || "");
      setStartDate(education.startDate || "");
      setEndDate(education.endDate || "");
      setError(null);
    }
  }, [isOpen, education]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

  const newErrors: typeof errors = {};

  if (!institution) newErrors.institution = "L’école est requise.";
  if (!degree) newErrors.degree = "Le diplôme est requis.";
  if (!fieldOfStudy) newErrors.fieldOfStudy = "La spécialité est requise.";
  if (!startDate) newErrors.startDate = "La date de début est requise.";

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    newErrors.endDate = "La date de fin doit être postérieure à la date de début.";
  }

 if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
    setLoading(true);

    const updatedData = {
      institution: institution.trim(),
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
    };

    try {
      if (!education.id) throw new Error("ID de l'éducation manquant");
      const updated = await educationService.updateCv(education.id, updatedData);
      onUpdate(updated);
      closeModal();
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'éducation.");
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
if (!education.id) {
    console.error("education ID manquant pour la suppression");
    return;
  }
  try {
    setLoading(true);
    await educationService.deleteEducationFromCandidate(cv.id, education.id); // ✅ appel API à supprimer
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
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
      

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              {/* Display saved education details */}
          
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Institution
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {education.institution || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Degree
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {education.degree || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Field of Study
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {education.fieldOfStudy || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Start Date
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {education.startDate || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  End Date
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {education.endDate || "N/A"}
                </p>
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
        <div className="w-full p-4 bg-white rounded-lg dark:bg-gray-900">
          <h4 className="text-xl font-semibold mb-4">Modifier la formation</h4>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label>École</Label>
                <Input value={institution} onChange={(e) => setinstitution(e.target.value)} disabled={loading} />

  {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
              </div>
              <div>
                <Label>Diplôme</Label>
                <Input value={degree} onChange={(e) => setDegree(e.target.value)} disabled={loading} />
                  {errors.degree && <p className="text-sm text-red-500">{errors.degree}</p>}

              </div>
              <div>
                <Label>Spécialité</Label>
                <Input value={fieldOfStudy} onChange={(e) => setfieldOfStudy(e.target.value)} disabled={loading} />*
                  {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy}</p>}

              </div>
              <div>
                <Label>Date début</Label>
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date) => setStartDate(date ? date.toISOString().split("T")[0] : "")}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}

              </div>
              <div>
                <Label>Date fin</Label>
                <DatePicker
                  selected={endDate ? new Date(endDate) : null}
                  onChange={(date) => setEndDate(date ? date.toISOString().split("T")[0] : "")}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}

            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outline" onClick={closeModal} disabled={loading}>Annuler</Button>
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
      Es-tu sûr de vouloir supprimer cette formation ? Cette action est irréversible.
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
