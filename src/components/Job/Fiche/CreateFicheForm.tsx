import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fichePosteService, certificationService, SkillService } from "../../../services";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import CreatableSelect from "react-select/creatable";
import { Skills } from "../../../../types/Skills";
import { Certification } from "../../../../types/certification";

export default function CreateFicheForm() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState<Skills[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skills[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<Certification[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    workplace: "",
    worktime: "TEMPS_PLEIN",
    mission: "",
    positionH: "",
    typeContrat: "CDI",
    minExperienceYears: 0,
    educationLevel: 1,
    requiredSkills: [],
    requiredCertifications: [],
  });

  useEffect(() => {
    SkillService.getAllSkills().then(setSkills);
    certificationService.getAll().then(setCertifications);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        requiredSkills: selectedSkills,
        requiredCertifications: selectedCerts,
      };
      await fichePosteService.create(payload);
      navigate("/FicheListPage");
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  const skillsOptions = skills.map(skill => ({
    label: skill.name,
    value: skill.id?.toString() || "",
    data: skill,
  }));

  const certOptions = certifications.map(cert => ({
    label: cert.name,
    value: cert.id?.toString() || "",
    data: cert,
  }));

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Créer une fiche de poste</h2>

      <Input placeholder="Titre" name="title" value={form.title} onChange={handleChange} />
      <Input placeholder="Description" name="description" value={form.description} onChange={handleChange} />
      <Input placeholder="Lieu de travail" name="workplace" value={form.workplace} onChange={handleChange} />
      <Input placeholder="Mission" name="mission" value={form.mission} onChange={handleChange} />
      <Input placeholder="Poste hiérarchique" name="positionH" value={form.positionH} onChange={handleChange} />

      <div>
        <label className="block mb-1">Type de contrat</label>
        <select name="typeContrat" value={form.typeContrat} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="STAGE">Stage</option>
          <option value="INTERIM">Intérim</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Temps de travail</label>
        <select name="worktime" value={form.worktime} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="TEMPS_PLEIN">Temps plein</option>
          <option value="TEMPS_PARTIEL">Temps partiel</option>
        </select>
      </div>

      <Input
        placeholder="Expérience minimale (années)"
        name="minExperienceYears"
        type="number"
        value={form.minExperienceYears}
        onChange={handleChange}
      />

      <Input
        placeholder="Niveau d'éducation"
        name="educationLevel"
        type="number"
        value={form.educationLevel}
        onChange={handleChange}
      />

      <div>
        <label className="block font-semibold mb-1">Compétences requises</label>
        <CreatableSelect
          isMulti
          options={skillsOptions}
          onChange={(selected) => {
            const selectedMapped = selected.map(opt => opt.data);
            setSelectedSkills(selectedMapped);
          }}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Certifications requises</label>
        <CreatableSelect
          isMulti
          options={certOptions}
          onChange={(selected) => {
            const selectedMapped = selected.map(opt => opt.data);
            setSelectedCerts(selectedMapped);
          }}
        />
      </div>

      <Button >Créer la fiche</Button>
    </form>
  );
}
