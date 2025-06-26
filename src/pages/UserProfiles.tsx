import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserMetaCardCard from "../components/Cv/Cv/UserMetaCard";
import CvExperienceCard from "../components/Cv/Cv/CvExperienceCard";
import CvEducationCard from "../components/Cv/Cv/CvEduCard";
import PageMeta from "../components/common/PageMeta";
import { Cv } from "../../types/Cv";
import { Education } from "../../types/Education";
import { Certification } from "../../types/certification";
import { Experience } from "../../types/Experience";
import { cvService, experienceService } from "../services";
import Alert from "../components/ui/alert/Alert";
import { Modal } from "../components/ui/modal";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PlusIcon } from "../icons";
import { SkillsList } from "../components/Cv/Cv/SkillsList";
import CertificationList from "../components/Cv/Cv/CertificationList";
import { educationService } from "../services";


export default function UserProfiles() {
  const { cvId } = useParams<{ cvId: string }>();
  const [cv, setCv] = useState<Cv | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state + form state
  const [isAddEduOpen, setIsAddEduOpen] = useState(false);
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
const [companyName, setCompanyName] = useState("");
const [jobTitle, setJobTitle] = useState("");
const [expStartDate, setExpStartDate] = useState<string>("");
const [expEndDate, setExpEndDate] = useState<string>("");
const [description, setDescription] = useState("");
const [expFormError, setExpFormError] = useState<string | null>(null);
const [expFormLoading, setExpFormLoading] = useState(false);
const [errorse, setErrorse] = useState<{
  companyName?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}>({});
  useEffect(() => {
    const fetchCvData = async () => {
      try {
        if (cvId) {
          const data = await cvService.getCvById(Number(cvId));
          setCv(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching CV data:", error);
        setLoading(false);
      }
    };

    fetchCvData();
  }, [cvId]);

const openAddExpModal = () => {
  setCompanyName("");
  setJobTitle("");
  setExpStartDate("");
  setExpEndDate("");
  setDescription("");
  setExpFormError(null);
  setIsAddExpOpen(true);
};

// Fermer modal expérience
const closeAddExpModal = () => {
  setIsAddExpOpen(false);
};
const [errors, setErrors] = useState<{
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}>({});
// Soumettre nouvelle expérience
const handleAddExperience = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Début handleAddExperience");

  const newErrorse: typeof errorse = {};

  if (!companyName) newErrorse.companyName = "L’entreprise est requise.";
  if (!jobTitle) newErrorse.jobTitle = "Le Poste est requis.";
  if (!expStartDate) newErrorse.startDate = "La date de début est requise.";
  if (expStartDate && expEndDate && new Date(expStartDate) >= new Date(expEndDate)) {
    newErrorse.endDate = "La date de fin doit être postérieure à la date de début.";
  }

  if (Object.keys(newErrorse).length > 0) {
    setErrorse(newErrorse);
    console.log("Validation échouée", newErrorse);
    return;
  }

  setErrorse({});
  setExpFormError(null);

  if (!companyName.trim() || !jobTitle.trim() || !expStartDate) {
    setExpFormError("Veuillez remplir les champs obligatoires : Entreprise, Poste, Date début.");
    console.log("Champs obligatoires manquants");
    return;
  }

  setExpFormLoading(true);

  const newExp: Experience = {
    companyName: companyName.trim(),
    jobTitle: jobTitle.trim(),
    startDate: expStartDate,
    endDate: expEndDate || "",
    description: description.trim() || "",
  };

  try {
    if (!cv?.id) throw new Error("ID du candidat manquant");
    console.log("Envoi au backend", newExp);

    const savedExperience = await experienceService.addExperienceToCandidate(cv.id, newExp);

    console.log("Réponse backend", savedExperience);

    setCv((prev) =>
      prev
        ? { ...prev, workExperience: [...(prev.workExperience || []), savedExperience] }
        : prev
    );

    setSuccessMessage("Expérience ajoutée avec succès.");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsAddExpOpen(false);
  } catch (error) {
    console.error("Erreur lors de l'ajout expérience", error);
    setExpFormError((error as Error).message);
  } finally {
    setExpFormLoading(false);
  }

  console.log("Fin handleAddExperience");
};


  const openAddEduModal = () => {
    // reset form fields
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartDate("");
    setEndDate("");
    setFormError(null);
    setIsAddEduOpen(true);
  };

  const closeAddEduModal = () => {
    setIsAddEduOpen(false);
  };
const handleAddEducation = async (e: React.FormEvent) => {
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
  setFormError(null);

  if (!institution.trim() || !degree.trim() || !startDate) {
    setFormError("Veuillez remplir les champs obligatoires : École, Diplôme, Date début.");
    return;
  }

  setFormLoading(true);

  const newEdu: Omit<Education, 'id'> = {
    institution: institution.trim(),
    degree: degree.trim(),
    fieldOfStudy: fieldOfStudy.trim() || "",
    startDate,
    endDate: endDate || "",
  };

  try {
    if (!cv?.id) throw new Error("ID du candidat manquant");

    const savedEducation = await educationService.addEducationToCandidate(cv.id, newEdu);

    setCv((prev) =>
      prev ? { ...prev, cvEducation: [...prev.cvEducation, savedEducation] } : prev
    );

    setSuccessMessage("Formation ajoutée avec succès.");
    setIsAddEduOpen(false);
  } catch (error) {
    setFormError((error as Error).message);
  } finally {
    setFormLoading(false);
    setTimeout(() => setSuccessMessage(null), 3000);
  }
};


const handleDeleteEducation = async (id: number) => {
  if (!cv?.id) return;

  try {
    console.log("handleDeleteEducation id:", id);

    setCv((prev) =>
      prev
        ? {
            ...prev,
            cvEducation: prev.cvEducation.filter((edu) => edu.id !== id),
          }
        : prev
    );
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    // Tu peux aussi afficher un message d'erreur ici si besoin
  }
};



  const handleDeleteExperience = (id?: number) => {
    setCv(prev =>
      prev
        ? {
            ...prev,
            workExperience: prev.workExperience.filter((exp) => exp.id !== id),
          }
        : prev
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!cv) return <div>CV non trouvé</div>;

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard"
        description="Page de profil React.js"
      />

      {successMessage && (
        <Alert
          variant="success"
          title="Succès"
          message={successMessage}
          showLink={false}
        />
      )}
<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
  <div className="mb-5 flex items-center justify-between lg:mb-7">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
      Profile
    </h3>

    {cv.cvFileUrl && (
      <a
        href={cv.cvFileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm
                   text-white font-medium shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0012.172 2H8a2 2 0 00-2 2v16a2 2 0 002 2z"
          />
        </svg>
        Voir le CV (PDF)
      </a>
    )}
  </div>

 


        <div className="space-y-6">
          <UserMetaCardCard
            cv={cv}
            onUpdate={(updatedCv) => {
              setCv(updatedCv);
              setSuccessMessage("Les infos personnelles sont modifiées.");
              setTimeout(() => setSuccessMessage(null), 3000);
            }}
          />

<div className="flex items-center justify-between mb-3">
  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
    Parcours éducatif
  </h4>
  <button
    onClick={openAddEduModal}
    className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs
               hover:bg-gray-50 hover:text-gray-800
               dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
  >
    {/* Tu peux remplacer ce SVG par une icône si tu veux */}
    <span className="inline-block w-5 h-5 text-gray-700 dark:text-gray-400 font-bold select-none">+</span>

    Ajouter une formation
  </button>
</div>

      {successMessage && (
        <Alert variant="success" title="Succès" message={successMessage} showLink={false} />
      )}

          {cv.cvEducation.map((education) => (
            <CvEducationCard
              key={education.id}
              cv={cv}
              education={education}
onDelete={() => {
  if (education.id !== undefined) {
    handleDeleteEducation(education.id);
  }
}}         
     onUpdate={(updatedEducation) => {
                setCv((prevCv) =>
                  prevCv
                    ? {
                        ...prevCv,
                        cvEducation: prevCv.cvEducation.map((edu) =>
                          edu.id === updatedEducation.id
                            ? updatedEducation
                            : edu
                        ),
                      }
                    : prevCv
                );
                setSuccessMessage("L'éducation a été modifiée.");
                setTimeout(() => setSuccessMessage(null), 3000);
              }}
            />
          ))}


<div className="flex items-center justify-between mb-3">
  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
     Expérience Professionnelle
  </h4>
  <button
    onClick={openAddExpModal} 
    className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs
               hover:bg-gray-50 hover:text-gray-800
               dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
  >
    {/* Tu peux remplacer ce SVG par une icône si tu veux */}
    <span className="inline-block w-5 h-5 text-gray-700 dark:text-gray-400 font-bold select-none">+</span>

    Ajouter une Expérience Professionnelle
  </button>
</div>


{successMessage && (
  <Alert variant="success" title="Succès" message={successMessage} showLink={false} />
)}

          {cv.workExperience.map((experience) => (
            <CvExperienceCard
              key={experience.id}
                            cv={cv}

              experience={experience}
              onDelete={() => {
  if (experience.id !== undefined) {
    handleDeleteExperience(experience.id);
  }
}} 
              onUpdate={(updatedExperience) => {
                setCv((prevCv) =>
                  prevCv
                    ? {
                        ...prevCv,
                        workExperience: prevCv.workExperience.map((exp) =>
                          exp.id === updatedExperience.id
                            ? updatedExperience
                            : exp
                        ),
                      }
                    : prevCv
                );
                setSuccessMessage("L'expérience a été modifiée.");
                setTimeout(() => setSuccessMessage(null), 3000);
              }}
            />
          ))}
          <div className="flex items-center justify-between mb-3"><SkillsList cv={cv} /></div>
                    <div className="flex items-center justify-between mb-3">{cv?.id && (
  <CertificationList cvId={cv.id} initialCertifications={cv.certifications} />
)}</div>

        </div>
        
         
      </div>
     
      {/* Modal d'ajout formation */}
      <Modal isOpen={isAddEduOpen} onClose={closeAddEduModal} className="max-w-[700px] m-4">
        <div className="w-full p-4 bg-white rounded-lg dark:bg-gray-900">
          <h4 className="text-xl font-semibold mb-4">Ajouter une formation</h4>
          <form onSubmit={handleAddEducation}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label>École <span className="text-red-600">*</span></Label>
                <Input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  disabled={formLoading}
                  
                />
                  {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}

              </div>
              <div>
                <Label>Diplôme <span className="text-red-600">*</span></Label>
                <Input
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  disabled={formLoading}
                  
                />
                  {errors.degree && <p className="text-sm text-red-500">{errors.degree}</p>}

              </div>
              <div>
                <Label>Spécialité</Label>
                <Input
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  disabled={formLoading}
                />
                               
                {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy}</p>}

              </div>
              <div>
                <Label>Date début <span className="text-red-600">*</span></Label>
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date) => setStartDate(date ? date.toISOString().split("T")[0] : "")}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  disabled={formLoading}
                  required
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
                  disabled={formLoading}
                />
                                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}

              </div>
            </div>

            {formError && <p className="text-red-600 mt-4">{formError}</p>}

            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outline" onClick={closeAddEduModal} disabled={formLoading}>
                Annuler
              </Button>
              <Button size="sm" disabled={formLoading}>
                {formLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      
      <Modal isOpen={isAddExpOpen} onClose={closeAddExpModal} className="max-w-[700px] m-4">
  <div className="w-full p-4 bg-white rounded-lg dark:bg-gray-900">
    <h4 className="text-xl font-semibold mb-4">Ajouter une expérience</h4>
<form onSubmit={handleAddExperience}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label>Entreprise <span className="text-red-600">*</span></Label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={expFormLoading}
            
          />
                          {errorse.companyName && <p className="text-sm text-red-500">{errorse.companyName}</p>}

        </div>
        <div>
          <Label>Poste <span className="text-red-600">*</span></Label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={expFormLoading}
            
          />
              {errorse.jobTitle && <p className="text-sm text-red-500">{errorse.jobTitle}</p>}

        </div>
        <div>
          <Label>Date début <span className="text-red-600">*</span></Label>
          <DatePicker
            selected={expStartDate ? new Date(expStartDate) : null}
            onChange={(date) =>
              setExpStartDate(date ? date.toISOString().split("T")[0] : "")
            }
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
            disabled={expFormLoading}
            required
          />{errorse.startDate && <p className="text-sm text-red-500">{errorse.startDate}</p>}

        </div>
        <div>
          <Label>Date fin</Label>
          <DatePicker
            selected={expEndDate ? new Date(expEndDate) : null}
            onChange={(date) =>
              setExpEndDate(date ? date.toISOString().split("T")[0] : "")
            }
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
            disabled={expFormLoading}
          />    {errorse.endDate && <p className="text-sm text-red-500">{errorse.endDate}</p>}


        </div>
        <div className="lg:col-span-2">
          <Label>Description</Label>
          <textarea
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={expFormLoading}
            rows={4}
          />
        </div>
      </div>

      {expFormError && <p className="text-red-600 mt-4">{expFormError}</p>}

      <div className="flex justify-end mt-6 gap-2">
        <Button variant="outline" onClick={closeAddExpModal} disabled={expFormLoading}>
          Annuler
        </Button>

    <Button size="sm" disabled={expFormLoading}>
                {expFormLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
      </div>
    </form>
  </div>
</Modal>
    </>
  );
}
