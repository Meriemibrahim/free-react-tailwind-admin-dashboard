import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Cv } from "../../../../types/Cv";
import { useState, useEffect } from "react";
import { cvService } from "../../../services";

type Props = {
  cv: Cv;
  onUpdate: (updatedCv: Cv) => void;
};

export default function UserMetaCardCard({ cv, onUpdate }: Props) {
  const { isOpen, openModal, closeModal } = useModal();

  // États locaux initialisés vides, puis mis à jour à l'ouverture
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emails, setEmails] = useState("");
  const [nationality, setNationality] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [languages, setLanguages] = useState<Record<string, string>>({});
const [newLanguage, setNewLanguage] = useState("");
const [newLanguageLevel, setNewLanguageLevel] = useState("B2");
const [hobbies, setHobbies] = useState<Record<string, string>>({});
const [errors, setErrors] = useState<Errors>({});
const [photo, setPhoto] = useState<File | null>(null);
const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

type Errors = {
  name?: string;
  phone?: string;
  emails?: string;
  nationality?: string;
  age?: string;
  gender?: string;
  linkedIn?: string;
  languages?: string;
  hobbies?: string;
};
  // Remplir les états quand modal s'ouvre
  useEffect(() => {
    if (isOpen && cv) {
      setName(cv.name || "");
      setAge(cv.age ?? "");
      setPhone(Array.isArray(cv.phone) ? cv.phone.join(" / ") : cv.phone || "");
      setEmails(Array.isArray(cv.emails) ? cv.emails.join(" / ") : cv.emails || "");
      setNationality(
        Array.isArray(cv.nationality) ? cv.nationality.join(" / ") : cv.nationality || ""
      );
      setGender(cv.gender || "");
      setLinkedIn(cv.linkedIn || "");
      setLanguages(cv.languages || {});
setHobbies(cv.hobbies || {});

      setError(null);
    }
  }, [isOpen, cv]);
 const validateForm = () => {
    const errs: Errors = {};

   if (!phone.trim()) {
  errs.phone = "Le téléphone est obligatoire.";
} else {
  // Split sur les virgules, puis trim de chaque numéro
  const phones = phone.split(" / ").map(p => p.trim());

  // Expression régulière pour valider un numéro (exemple international simple)
  const phoneRegex = /^\+?[\d\s\-]{5,15}$/;

  // Vérifier que tous les numéros sont valides
  if (!phones.every(p => phoneRegex.test(p))) {
    errs.phone = "Un ou plusieurs numéros de téléphone sont invalides.";
  }
}

    if (!emails.trim()) errs.emails = "L'email est obligatoire.";
    else {
      // Vérifie plusieurs emails séparés par virgules
      const mails = emails.split("/").map((e) => e.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mails.every((mail) => emailRegex.test(mail)))
        errs.emails = "Un ou plusieurs emails sont invalides.";
    }

    if (!nationality.trim()) errs.nationality = "La nationalité est obligatoire.";

    if (age === "" || age === null) errs.age = "L'âge est obligatoire.";
    else if (age < 0 || age > 120) errs.age = "L'âge doit être entre 0 et 120.";

    if (!gender.trim()) errs.gender = "Le genre est obligatoire.";

    if (linkedIn && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(linkedIn))
      errs.linkedIn = "Lien LinkedIn invalide.";

    // Validation langues - vérifier que chaque langue et niveau sont corrects
    Object.entries(languages).forEach(([lang, level]) => {
      if (!lang.trim()) errs.languages = "Chaque langue doit être renseignée.";
      if (!["A1","A2","B1","B2","C1","C2"].includes(level))
        errs.languages = "Chaque niveau de langue doit être valide.";
    });

    // Validation loisirs
    Object.entries(hobbies).forEach(([hobby, freq]) => {
      if (!hobby.trim()) errs.hobbies = "Chaque loisir doit être renseigné.";
      // tu peux ajouter un contrôle fréquence si tu veux
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);
  setError(null);

  const updatedData = {
    name,
    phone: phone.split(" / ").map((p) => p.trim()),
    emails: emails.split(" / ").map((e) => e.trim()),
    nationality: nationality.split(" / ").map((n) => n.trim()),
    age: age === "" ? null : age,
    gender,
    linkedIn,
    languages,
    hobbies,
  };

  try {
    if (!cv.id) throw new Error("ID du CV manquant");

    const formData = new FormData();

    // Ajout du fichier image
    if (photo instanceof File) {
      formData.append("file", photo);
    }

    // Ajout des données du CV comme JSON
    const blob = new Blob([JSON.stringify(updatedData)], {
      type: "application/json",
    });
    formData.append("cvDetails", blob); // ⚠️ changer @RequestBody en @RequestPart("cvDetails")

    const updatedCv = await cvService.updateCv(cv.id, formData);
    onUpdate(updatedCv);
    closeModal();
  } catch (err) {
    setError("Erreur lors de la mise à jour du CV.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

function niveauToDots(niveau: string) {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const index = levels.indexOf(niveau.toUpperCase());
  return index === -1 ? 0 : index + 1;
}
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Informations Personnel
            </h4>
<div className="mb-4 flex items-center justify-left lg:mb-6">
  <img
    src={cv.photoUrl}
    alt={`Photo de ${cv.name}`}
    className="h-32 w-32 rounded-full object-cover border-2 border-gray-300 shadow-md dark:border-gray-600"
  />
</div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Nom</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{cv.name}</p>
                
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{cv.status}</p>
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Emails</p>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90 space-y-1">
                  {Array.isArray(cv.emails) &&
                    cv.emails
                      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                      .map((email, idx) => (
                        <a
                          key={idx}
                          href={`mailto:${email}`}
                          className="block text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {email}
                        </a>
                      ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {Array.isArray(cv.phone) ? cv.phone.join(" / ") : cv.phone}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">LinkedIn</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  <a
                    href={cv.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {cv.linkedIn}
                  </a>
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Nationalité</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {Array.isArray(cv.nationality) ? cv.nationality.join(" / ") : cv.nationality}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Âge</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{cv.age}</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Genre</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{cv.gender}</p>
              </div>
               <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400"></p>
            {cv.hobbies && Object.keys(cv.hobbies).length > 0 && (
  <div>
    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Loisirs</p>
    <ul className="text-sm font-medium text-gray-800 dark:text-white/90 space-y-1">
      {Object.entries(cv.hobbies).map(([loisir]) => (
        <li >
          <span className="font-semibold">{loisir}</span> 
        </li>
      ))}
    </ul>
  </div>
)}
  </div>
               <div>
              {cv.languages && Object.keys(cv.languages).length > 0 && (
  <div>
    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Langues</p>

    <ul className="grid grid-cols-2 gap-x-5 gap-y-2">
  {Object.entries(cv.languages).map(([langue, niveau], index) => {
    const filledCount = niveauToDots(niveau);
    const totalDots = 6;
    return (
      <li key={index} className="flex items-center gap-2">
        <span className="font-semibold min-w-[70px]">{langue}:</span>
        <div className="flex space-x-1">
          {[...Array(totalDots)].map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full border ${
                i < filledCount ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </li>
    );
  })}
</ul>

  </div>
)}
</div>
  
            </div>
           
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            {/* Icon SVG */}
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
            Modifier
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Modifier les informations personnelles
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour les informations de votre profil personnel.
            </p>
          </div>

          <form className="flex flex-col" onSubmit={handleSave}>
          <div className="px-2 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-5">

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Changer la photo */}
 {/* Section Changer la photo */}
          <div className="lg:col-span-2 flex flex-col items-start gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <Label>Photo de profil</Label>
            <div className="flex items-center gap-4">
              {previewPhoto || cv.photoUrl ? (
                <img
                  src={previewPhoto || cv.photoUrl}
                  alt="Photo de profil"
                  className="w-28 h-28 object-cover rounded-full border-2 border-gray-300 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-100 text-gray-400 text-sm">
                  Pas d’image
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhoto(file);
                      setPreviewPhoto(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 transition"
                >
                  Changer la photo
                </label>
              </div>
            </div>
          </div>

                <div>
                  <Label>Nom</Label>
                  <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="12345678 / 12345678" />
                  <p className="text-xs text-gray-500 mt-1">
                  par ex. : <br />
  <em>12345678 / 12345678</em>
</p>
                                  {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

                </div>
                <div>
                  <Label>Email(s) </Label> 
                  <Input type="text" value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="exemple@domaine.com / autre@example.com"/>
                         <p className="text-xs text-gray-500 mt-1">
 par ex. : <br />
  <em>exemple@domaine.com, autre@example.com</em>
</p>
                                  {errors.emails && <p className="text-red-600 text-sm">{errors.emails}</p>}

                </div>
                
                <div>
                  <Label>Nationalité</Label>
                  <Input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                  />
                                  {errors.nationality && <p className="text-red-600 text-sm">{errors.nationality}</p>}

                </div>
                <div>
                  <Label>Âge</Label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value === "" ? "" : Number(e.target.value))
                      
                    }
                    min="0" // string here
                  />
                                  {errors.age && <p className="text-red-600 text-sm">{errors.age}</p>}

                </div>
                <div>
                  <Label>Genre</Label>
                  <Input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                                  {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}

                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input type="text" value={linkedIn}  onChange={(e) => setLinkedIn(e.target.value)} />
                {errors.linkedIn && <p className="text-red-600 text-sm">{errors.linkedIn}</p>}

                </div>
  <div className="lg:col-span-2">
  <Label>Langues</Label>
  <div className="flex flex-wrap gap-2 mb-2">
    {Object.entries(languages).map(([lang, level]) => (
      <span
        key={lang}
        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-800 dark:text-white"
      >
        {lang}: {level}
        <button
          type="button"
          onClick={() => {
            const updated = { ...languages };
            delete updated[lang];
            setLanguages(updated);
          }}
          className="ml-2 text-blue-500 hover:text-red-500"
        >
          ✕
        </button>
      </span>
    ))}
  </div>
<div className="flex gap-2 items-center">
  <input
    type="text"
    placeholder="Ajouter une langue"
    value={newLanguage}
    onChange={(e) => setNewLanguage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (newLanguage.trim() && !languages[newLanguage]) {
          setLanguages(prev => ({ ...prev, [newLanguage]: newLanguageLevel }));
          setNewLanguage("");
        }
      }
    }}
    className="px-2 py-1 border rounded"
  />
  <select
    value={newLanguageLevel}
    onChange={(e) => setNewLanguageLevel(e.target.value)}
    className="px-2 py-1 border rounded"
  >
    <option value="A1">A1</option>
    <option value="A2">A2</option>
    <option value="B1">B1</option>
    <option value="B2">B2</option>
    <option value="C1">C1</option>
    <option value="C2">C2</option>
  </select>
</div>
    <p className="text-xs text-gray-500 mt-1">
                  Tapez ENTRER 
  
</p>
                {errors.languages && <p className="text-red-600 text-sm">{errors.languages}</p>}

</div>

{/* Loisirs */}
<div className="lg:col-span-2">
  <Label>Loisirs</Label>
  <div className="flex flex-wrap gap-2 mb-2">
    {Object.entries(hobbies).map(([hobby]) => (
      <span
        key={hobby}
        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full dark:bg-green-800 dark:text-white"
      >
        {hobby}
        <button
          type="button"
          onClick={() => {
            const updated = { ...hobbies };
            delete updated[hobby];
            setHobbies(updated);
          }}
          className="ml-2 text-green-500 hover:text-red-500"
        >
          ✕
        </button>
      </span>
    ))}
  </div>
  <div className="flex gap-2">
    <input
  type="text"
  placeholder="Ajouter une langue"
  className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !languages[value]) {
       setHobbies((prev) => ({ ...prev, [value]: "B2"  }));
        e.currentTarget.value = "";
      }
    }
  }}
/>
  
  </div>
      <p className="text-xs text-gray-500 mt-1">
                  Tapez ENTRER 
  
</p>
                  {errors.hobbies && <p className="text-red-600 text-sm">{errors.hobbies}</p>}

</div>

              </div>
            </div>

            {error && <p className="my-2 text-center text-sm text-red-600">{error}</p>}

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 sm:gap-4">
            <Button
    onClick={closeModal}
    variant="outline"
    className="w-full flex-1 sm:w-auto"
    disabled={loading}
  >
    Annuler
  </Button>
  <Button
    className="w-full flex-1 sm:w-auto"
    disabled={loading}
   
  >
   {loading ? "Chargement..." : "Enregistrer"}
  </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
