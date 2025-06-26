import { useEffect, useState } from "react";
import { Skills } from "../../../../types/Skills";
import { SkillService } from "../../../services";

import { Cv } from "../../../../types/Cv";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Modal } from "../../ui/modal";
import Alert from "../../ui/alert/Alert";

export const SkillsList = ({ cv }: { cv: Cv }) => {
  const [skills, setSkills] = useState<Skills[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [allSkills, setAllSkills] = useState<Skills[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
const [editingSkill, setEditingSkill] = useState<Skills | null>(null);
const [updatedProficiency, setUpdatedProficiency] = useState<string>("");


  useEffect(() => {
    setSkills(cv.skills || []);
    SkillService.getAllSkills().then(setAllSkills);
  }, [cv]);

 

const handleRemove = (id: number) => {
  if (window.confirm("Retirer cette compétence du CV ?")) {
    SkillService.unaffectFromCv(cv.id!, id).then(() => {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setSuccessMessage("Compétence retirée");
      setTimeout(() => setSuccessMessage(null), 3000);
    });
  }
};
const handleEditSkill = (skill: Skills) => {
  setEditingSkill(skill);
  setUpdatedProficiency(skill.proficiencyLevel || "");
};
const handleAddSkill = async () => {
  if (selectedSkillIds.length > 0) {
    // Ajouter plusieurs compétences existantes
    for (const skillId of selectedSkillIds) {
      const skill = allSkills.find((s) => s.id === skillId);
      if (skill) {
        await SkillService.affectToCv(cv.id!, skillId);
        setSkills((prev) => [...prev, skill]);
      }
    }

    setSuccessMessage("Compétences ajoutées avec succès");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsAddOpen(false);
    setSelectedSkillIds([]);
    return;
  }

  if (newSkillName && newSkillLevel) {
    const created = await SkillService.createSkill({
      name: newSkillName,
      proficiencyLevel: newSkillLevel,
    });
     if (created) {
    await SkillService.affectToCv(cv.id!, created.id!);
    setSkills((prev) => [...prev, created]);
    setSuccessMessage("Nouvelle compétence ajoutée");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsAddOpen(false);
    setNewSkillName("");
    setNewSkillLevel("");
  }}
};

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6">
   <div className="flex items-center justify-between mb-4">
  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mr-4">Compétences</h4>
  <button
    onClick={() => setIsAddOpen(true)}
    className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
  >
    <span className="inline-block w-5 h-5 text-gray-700 dark:text-gray-400 font-bold select-none">+</span>
    Ajouter Compétence
  </button>
</div>


      {successMessage && (
        <Alert variant="success" title="Succès" message={successMessage} showLink={false} />
      )}

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 transition-transform hover:scale-105"
          >
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-md font-semibold text-gray-800 dark:text-white">{skill.name}</h5>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  skill.proficiencyLevel === 'Avancé'
                    ? 'bg-green-100 text-green-800'
                    : skill.proficiencyLevel === 'Intermédiaire'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {skill.proficiencyLevel}
              </span>
            </div>
            <div className="flex justify-end gap-2 text-sm">
          <button
  onClick={() => {handleEditSkill(skill);
  }}
  className="text-blue-500 hover:underline"
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
</button>
              <button
                onClick={() => handleRemove(skill.id!)}
                className="text-red-500 hover:underline"
              >
                <svg
      className="fill-current"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6Z" />
    </svg>
              </button>
            </div>
          </div>
        ))}
      </div><Modal
  isOpen={isAddOpen}
  onClose={() => setIsAddOpen(false)}
  className="w-[95%] sm:w-[90%] md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto rounded-2xl shadow-xl"
>
  <div className="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-2xl max-h-[80vh] overflow-y-auto">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Ajouter une compétence</h3>

    <Input
      placeholder="🔍 Rechercher une compétence existante..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setSelectedSkillIds([]); // Réinitialiser la sélection si nouvelle recherche
      }}
      className="w-full"
    />

    {filteredSkills.length > 0 ? (
      <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {filteredSkills.map((s) => {
          const isSelected = selectedSkillIds.includes(s.id!);
          return (
            <li
              key={s.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <span className="text-sm font-medium text-gray-800 dark:text-white">{s.name}</span>
              <button
                className={`text-sm px-3 py-1 rounded-md ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-white dark:hover:bg-blue-800"
                }`}
                onClick={() => {
                  setSelectedSkillIds((prev) =>
                    isSelected ? prev.filter((id) => id !== s.id) : [...prev, s.id!]
                  );
                }}
              >
                {isSelected ? "✔ Sélectionné" : "Sélectionner"}
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🔧 Aucune compétence trouvée. Vous pouvez en créer une nouvelle :
        </p>

        <div className="space-y-2">
          <Label>Nom</Label>
          <Input value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Ex: React, SQL..." />
        </div>
        <div className="space-y-2">
          <Label>Niveau</Label>
          <Input value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} placeholder="Débutant, Intermédiaire, Avancé..." />
        </div>
      </div>
    )}

    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Button variant="outline" onClick={() => setIsAddOpen(false)}>
        Annuler
      </Button>
      <Button
        onClick={handleAddSkill}
        disabled={
          selectedSkillIds.length === 0 &&
          (newSkillName.trim() === "" || newSkillLevel.trim() === "")
        }
      >
        Ajouter
      </Button>
    </div>
  </div>
</Modal>
<Modal isOpen={!!editingSkill} onClose={() => setEditingSkill(null)} className="max-w-md rounded-xl shadow-xl">
  <div className="p-6 space-y-4 bg-white dark:bg-gray-900 rounded-xl">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Modifier la compétence</h3>

    <div className="space-y-2">
      <Label>Nom</Label>
      <Input value={editingSkill?.name || ""} disabled />
    </div>

    <div className="space-y-2">
      <Label>Niveau de compétence</Label>
      <Input
        value={updatedProficiency}
        onChange={(e) => setUpdatedProficiency(e.target.value)}
        placeholder="Ex : Débutant, Intermédiaire, Avancé"
      />
    </div>

    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Button variant="outline" onClick={() => setEditingSkill(null)}>
        Annuler
      </Button>
      <Button
        onClick={async () => {
          if (editingSkill) {
            const updated = { ...editingSkill, proficiencyLevel: updatedProficiency };
            await SkillService.updateSkill(updated);
            setSkills((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            );
            setSuccessMessage("Compétence mise à jour !");
            setTimeout(() => setSuccessMessage(null), 3000);
            setEditingSkill(null);
          }
        }}
      >
        Enregistrer
      </Button>
    </div>
  </div>
</Modal>

    </div>
  );
};
