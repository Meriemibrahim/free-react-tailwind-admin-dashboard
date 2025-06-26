import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FichePoste } from "../../../../types/FichePoste";
import { fichePosteService } from "../../../services/fichePosteService";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { SkillCard } from "../../Cv/Cv/SkillCard";
import CertificationCard from "../../Cv/Cv/CertificationCard";
import CreatableSelect from "react-select/creatable";
import { Skills } from "../../../../types/Skills";
import { Certification } from "../../../../types/certification";
import { SkillService, certificationService } from "../../../services";
type Props = {
  fiche: FichePoste;
  onUpdate: (updated: FichePoste) => void;
  onDelete: () => void;
};

const Icon = {
  location: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 21C12 21 19 13.5 19 8.5C19 5.46243 16.5376 3 13.5 3C10.4624 3 8 5.46243 8 8.5C8 13.5 12 21 12 21Z" />
      <circle cx="12" cy="8.5" r="2.5" />
    </svg>
  ),
  contract: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M9 12h6" />
      <path d="M12 9v6" />
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  ),
  clock: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  education: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14v7" />
      <path d="M3 9v7a9 9 0 0018 0v-7" />
    </svg>
  ),
  experience: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M20 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6" />
      <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  skills: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M9 12l2 2 4-4" />
      <path d="M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
    </svg>
  ),
  certification: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2l7 7-7 7-7-7 7-7z" />
      <path d="M12 9v6" />
      <path d="M9 12h6" />
    </svg>
  ),
  offers: (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M3 7h18" />
      <path d="M3 12h18" />
      <path d="M3 17h18" />
    </svg>
  ),
};

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${color}`}
  >
    {children}
  </span>
);



export default function FichePostedetailsCard({ fiche, onUpdate, onDelete }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [skills, setSkills] = useState<Skills[]>([]);
const [certifications, setCertifications] = useState<Certification[]>([]);
const [selectedSkills, setSelectedSkills] = useState<Skills[]>([]);
const [selectedCerts, setSelectedCerts] = useState<Certification[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    workplace: "",
    mission: "",
    positionH: "",
    typeContrat: "CDI",
  });
  const navigate = useNavigate();
  const skillOptions = skills.map(skill => ({
  label: skill.name,
  value: skill.id?.toString() || "",
  data: skill,
}));

const certOptions = certifications.map(cert => ({
  label: cert.name,
  value: cert.id?.toString() || "",
  data: cert,
}));
useEffect(() => {
  if (isOpen && fiche) {
    setForm({
      title: fiche.title,
      description: fiche.description,
      workplace: fiche.workplace,
      mission: fiche.mission,
      positionH: fiche.positionH,
      typeContrat: fiche.typeContrat,
    });

    setSelectedSkills(fiche.requiredSkills || []);
    setSelectedCerts(fiche.requiredCertifications || []);

    SkillService.getAllSkills().then(setSkills);
    certificationService.getAll().then(setCertifications);
  }
}, [isOpen, fiche]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSave = async () => {
  try {
    const updated = await fichePosteService.update(fiche.id!, {
      ...form,
      requiredSkills: selectedSkills,
      requiredCertifications: selectedCerts,
    });
    onUpdate(updated);
    closeModal();
  } catch (err) {
    console.error("Erreur de mise à jour", err);
  }
};


  const handleDelete = async () => {
    try {
      await fichePosteService.delete(fiche.id!);
      onDelete();
    } catch (err) {
      console.error("Erreur de suppression", err);
    }
  };

  return (
    <>
      <section className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 my-6">
        <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{fiche.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{fiche.workplace}</p>
          <section className="mt-6 flex justify-end">
  <Button onClick={() => navigate(`/${fiche.id}/Jobs`)}>

    Voir les offres associées
  </Button>
</section>

        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700 dark:text-gray-300">

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {Icon.location}
              <span className="font-medium text-gray-900 dark:text-white">Lieu de travail:</span>
              <span>{fiche.workplace}</span>
            </div>

            <div className="flex items-center gap-3">
              {Icon.contract}
              <span className="font-medium text-gray-900 dark:text-white">Type de contrat:</span>
              <Badge color="bg-green-100 text-green-800">{fiche.typeContrat}</Badge>
            </div>

            <div className="flex items-center gap-3">
              {Icon.clock}
              <span className="font-medium text-gray-900 dark:text-white">Temps de travail:</span>
              <Badge color="bg-blue-100 text-blue-800">
                {fiche.worktime === "TEMPS_PLEIN" ? "Temps plein" : "Temps partiel"}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {Icon.education}
              <span className="font-medium text-gray-900 dark:text-white">Niveau d'études minimum:</span>
              <Badge color="bg-purple-100 text-purple-800">{fiche.educationLevel}</Badge>
            </div>

            <div className="flex items-center gap-3">
              {Icon.experience}
              <span className="font-medium text-gray-900 dark:text-white">Expérience minimale (années):</span>
              <Badge color="bg-orange-100 text-orange-800">{fiche.minExperienceYears}</Badge>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{fiche.mission}</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{fiche.description}</p>
            </section>

            <section>
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Compétences requises</h3>
  {fiche.requiredSkills.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fiche.requiredSkills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onEdit={() => {}}      // pas d'action ici
          onDelete={() => {}}    // idem
        />
      ))}
    </div>
  ) : (
    <p className="italic text-gray-400">Aucune compétence requise</p>
  )}
</section>


           <section className="mt-6">
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Certifications requises</h3>
  {fiche.requiredCertifications.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fiche.requiredCertifications.map((cert) => (
        <CertificationCard
          key={cert.id}
          certification={cert}
        />
      ))}
    </div>
  ) : (
    <p className="italic text-gray-400">Aucune certification requise</p>
  )}
</section>


   

          </div>
        </div>

        <footer className="mt-8 flex justify-end gap-4">
              <button
                      onClick={openModal}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                      {/* Icon Modifier */}
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
        </footer>
      </section>
            <section className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 my-6">


  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Offres associées</h3>
  <iframe
    src={`${fiche.pdfFile}`}
    title="Offres associées"
    className="w-full h-[600px] rounded-lg border border-gray-300 dark:border-gray-700"
  />
</section>

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-xl">
  <div className="p-6 bg-white dark:bg-gray-900 rounded-xl space-y-4">
    <h3 className="text-lg font-bold">Modifier la fiche</h3>

    <Label>Titre</Label>
    <Input name="title" value={form.title} onChange={handleChange} />

    <Label>Lieu</Label>
    <Input name="workplace" value={form.workplace} onChange={handleChange} />

    <Label>Mission</Label>
    <Input name="mission" value={form.mission} onChange={handleChange} />

    <Label>Position H</Label>
    <Input name="positionH" value={form.positionH} onChange={handleChange} />


    <Label>Compétences requises</Label>
    <CreatableSelect
      isMulti
      options={skillOptions}
      value={selectedSkills.map(skill => ({
        label: skill.name,
        value: skill.id?.toString() || "",
        data: skill,
      }))}
      onChange={(selected) => setSelectedSkills(selected.map(opt => opt.data))}
    />

    <Label>Certifications requises</Label>
    <CreatableSelect
      isMulti
      options={certOptions}
      value={selectedCerts.map(cert => ({
        label: cert.name,
        value: cert.id?.toString() || "",
        data: cert,
      }))}
      onChange={(selected) => setSelectedCerts(selected.map(opt => opt.data))}
    />

    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Button variant="outline" onClick={closeModal}>Annuler</Button>
      <Button onClick={handleSave}>Enregistrer</Button>
    </div>
  </div>
</Modal>


      {/* Modal Suppression */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} className="max-w-md">
        <div className="p-6 text-center">
          <h3 className="mb-4 text-lg font-semibold">Confirmer la suppression</h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Es-tu sûr de vouloir supprimer cette fiche de poste ?</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button onClick={handleDelete}>Supprimer</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
