import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import { Cv } from "../../../../types/Cv";
import { cvService } from "../../../services";

export default function AddCvForm({ closeModal }: { closeModal: () => void }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [emails, setEmails] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [nationality, setNationality] = useState("");

  const [languages, setLanguages] = useState<Record<string, string>>({});
  const [newLanguage, setNewLanguage] = useState("");
  const [newLanguageLevel, setNewLanguageLevel] = useState("B2");

  const [hobbies, setHobbies] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setLoading(true);

    const formData = new FormData();
    const cvData: Partial<Cv> = {
      name,
      age: age === "" ? undefined : Number(age),
      gender,
      linkedIn,
      emails: emails.split("/").map((s) => s.trim()),
      phone: phone.split("/").map((s) => s.trim()),
      nationality: nationality.split("/").map((s) => s.trim()),
      languages,
      hobbies,
    };

    formData.append("cvDetails", new Blob([JSON.stringify(cvData)], { type: "application/json" }));
    if (photo) formData.append("photo", photo);
    if (cvFile) formData.append("cvFile", cvFile);

    try {
      const newCv = await cvService.createCvForm(formData);
      closeModal?.();
      navigate(`/cv-profile/${newCv.id}`);
    } catch (err: any) {
      setError("Erreur lors de l'envoi du formulaire.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
      <form className="flex flex-col" onSubmit={handleSave}>
        <div className="px-2 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-5">
   <div className="lg:col-span-2 flex flex-col gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
  <Label>Documents</Label>
  
  <div className="flex flex-col lg:flex-row justify-between items-center gap-6 w-full">
    {/* Section photo */}
    <div className="flex items-center gap-4">
      {previewPhoto ? (
        <img
          src={previewPhoto}
          alt="Aperçu"
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
    </div>
    

   {/* Section fichier PDF */}
<div className="flex flex-col items-start">
    {cvFile && (
    <span className="mt-2 text-sm text-gray-700 dark:text-gray-200">
      <strong>{cvFile.name}</strong>
    </span>
  )}
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
    className="hidden"
    id="file-upload"
    required
  />
  <label
    htmlFor="file-upload"
    className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 transition"
  >
    Télécharger Cv
  </label>

  {/* Affichage du nom du fichier sélectionné */}
  
</div>
            <InputField label="Nom" value={name} setValue={setName} error={errors.name} />
            <InputField label="Téléphone" value={phone} setValue={setPhone} error={errors.phone} />
            <InputField label="Email(s)" value={emails} setValue={setEmails} error={errors.emails} />
            <InputField label="Nationalité" value={nationality} setValue={setNationality} error={errors.nationality} />
            <InputField label="Âge" type="number" value={age} setValue={setAge} error={errors.age} />
            <InputField label="Genre" value={gender} setValue={setGender} error={errors.gender} />
            <InputField label="LinkedIn" value={linkedIn} setValue={setLinkedIn} error={errors.linkedIn} />

            {/* Fichier PDF */}
          

            {/* Langues */}
            <div className="lg:col-span-2">
              <Label>Langues</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {Object.entries(languages).map(([lang, level]) => (
                  <span key={lang} className="inline-flex items-center px-3 py-1 bg-blue-100 text-sm rounded-full">
                    {lang}: {level}
                    <button type="button" onClick={() => {
                      const updated = { ...languages };
                      delete updated[lang];
                      setLanguages(updated);
                    }} className="ml-2 text-red-500 hover:text-red-700">✕</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Langue"
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
                  className="px-2 py-1 border rounded w-full"
                />
                <select value={newLanguageLevel} onChange={(e) => setNewLanguageLevel(e.target.value)} className="px-2 py-1 border rounded">
                  {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loisirs */}
            <div className="lg:col-span-2">
              <Label>Loisirs</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {Object.keys(hobbies).map((hobby) => (
                  <span key={hobby} className="inline-flex items-center px-3 py-1 bg-green-100 text-sm rounded-full">
                    {hobby}
                    <button type="button" onClick={() => {
                      const updated = { ...hobbies };
                      delete updated[hobby];
                      setHobbies(updated);
                    }} className="ml-2 text-red-500 hover:text-red-700">✕</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ajouter un loisir"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value && !hobbies[value]) {
                      setHobbies((prev) => ({ ...prev, [value]: "souvent" }));
                      e.currentTarget.value = "";
                    }
                  }
                }}
                className="w-full px-3 py-2 text-sm border rounded"
              />
            </div>
      
        {error && <p className="my-2 text-center text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={closeModal} variant="outline" disabled={loading}>
            Annuler
          </Button>
          <Button  disabled={loading}>
            {loading ? "Chargement..." : "Enregistrer"}
          </Button>
        </div>
         </div>
      </form>
    </div>
  );
}

// ➕ Petit composant pour simplifier les champs
function InputField({
  label,
  value,
  setValue,
  error,
  type = "text",
}: {
  label: string;
  value: any;
  setValue: (val: any) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => setValue(e.target.value)} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
