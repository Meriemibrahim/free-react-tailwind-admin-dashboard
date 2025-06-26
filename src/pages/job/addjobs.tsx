import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import { Modal } from "../../components/ui/modal";
import CreatableSelect from "react-select/creatable"; // import react-select's CreatableSelect

import { jobService, certificationService, SkillService, fichePosteService } from "../../services";
import { Skills } from "../../../types/Skills";
import { Certification } from "../../../types/certification";
import { Job } from "../../../types/Job";
import { useParams } from "react-router";
import { FichePoste } from "../../../types/FichePoste";

export default function CreateJobForm() {
    const { id } = useParams<{ id?: string }>();
const bId = id ? Number(id) : 0;
const validJobId = !isNaN(bId) ? bId : null;
  const [skills, setSkills] = useState<Skills[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skills[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<Certification[]>([]);
  
  const [fiches, setFiches] = useState<{ id: number; title: string }[]>([]);
  const [selectedid, setSelectedid] = useState<number | null>(validJobId);
  const [selectedfichedeposte, setSelectedfichedeposte] = useState<FichePoste | undefined>();

  const [jobData, setJobData] = useState<Job>({
    title: "",
    description: "",
    location: "",
    requiredSkills: [],
    requiredCertifications: [],
    educationLevel: "",
    minExperienceYears: 0,
    ficheDePoste:selectedfichedeposte,
    
  });

  // Modals
  const [isSkillModalOpen, setSkillModalOpen] = useState(false);
  const [isCertModalOpen, setCertModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<Skills>({ name: "", proficiencyLevel: "" });
  const [newCert, setNewCert] = useState<Certification>({ name: "", provider: "" });

  // Fetch Skills and Certifications
  useEffect(() => {
    fichePosteService.getById(validJobId!).then(setSelectedfichedeposte);
    SkillService.getAllSkills().then(setSkills);
    const fetchCerts = async () => {
      try {
        const data = await certificationService.getAll();
        if (Array.isArray(data)) {
          setCertifications(data);
        } else {
          console.error("Certifications API did not return an array:", data);
        }
      } catch (err) {
        console.error("Failed to fetch certifications:", err);
      }
    };
    fetchCerts();
    if (!id) {
    fichePosteService.getAll()
        .then( setFiches)
        .catch(console.error);
    }
  }, [id]);

  const handleSubmit = async () => {
     if (!selectedid) {
      alert("Please select a fiche de poste");
      }
    const payload: Job = {
      ...jobData,
      requiredSkills: selectedSkills,
      requiredCertifications: selectedCerts,
      ficheDePoste: selectedfichedeposte,  // أضف الـ fichePosteId هنا

    };
    await jobService.create(payload);
    alert("Job created successfully!");
  };

  const addSkill = async () => {
    const saved = await SkillService.createSkill(newSkill); // Ensure this returns a valid Skills object
    if (!saved) return; // Guard clause to exit if it's undefined or void

    // Update the state with the new skill
    setSkills(prev => [...prev, saved]);
    setSelectedSkills(prev => [...prev, saved]);

    // Reset form state after successful addition
    setNewSkill({ name: "", proficiencyLevel: "" });

    // Close modal after adding
    setSkillModalOpen(false);
  };

  const addCert = async () => {
    const saved = await certificationService.create(newCert);
    setCertifications(prev => [...prev, saved]);
    setSelectedCerts(prev => [...prev, saved]);
    setNewCert({ name: "", provider: "", dateIssued: "" });
    setCertModalOpen(false);
  };

  // Utility function to map skills to options for react-select

  const skillsOptions = skills.map(skill => {
    const skillId = skill.id !== undefined ? skill.id.toString() : ''; // Default to an empty string if cert.id is undefined
    return {
      label: skill.name,
      value: skillId,
      __isNew__: false,  // Set to true if it's a new certification
      data: skill,  // Attach the entire certification object
    };
  });
  // Utility function to map certifications to options for react-select
  const certificationOptions = certifications.map(cert => {
    const certId = cert.id !== undefined ? cert.id.toString() : ''; // Default to an empty string if cert.id is undefined
    return {
      label: cert.name,
      value: certId,
      __isNew__: false,  // Set to true if it's a new certification
      data: cert,  // Attach the entire certification object
    };
  });
  

  return (
    <div className="p-6">
      <PageMeta title="Create Job" description="" />
      <PageBreadcrumb pageTitle="Create Job" />

      <div className="space-y-4">
        <div>
        <label className="block mb-2 font-semibold">Fiche de Poste</label>
        {id ? (
          // عرض اسم الـ fichePoste فقط، غير قابل للتعديل
          <input
            type="text"
            value={selectedfichedeposte?.title}
            readOnly
            className="bg-gray-100 cursor-not-allowed px-3 py-2 rounded"
          />
        ) : (
          // select لاختيار fichePoste
          <select
            value={selectedid?? ""}
            onChange={(e) => setSelectedid(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">-- Select a fiche de poste --</option>
            {fiches.map(fiche => (
              <option key={fiche.id} value={fiche.id}>
                {fiche.title}
              </option>
            ))}
          </select>
        )}
      </div>
        <Input placeholder="Job Title" value={jobData.title} onChange={e => setJobData({ ...jobData, title: e.target.value })} />
        <TextArea
          placeholder="Description"
          value={jobData.description}
          onChange={(value: string) =>
            setJobData({ ...jobData, description: value })
          }
        />
        <Input placeholder="Location" value={jobData.location} onChange={e => setJobData({ ...jobData, location: e.target.value })} />
        <Input
          placeholder="Education Level"
          value={jobData.educationLevel || ""}
          onChange={(e) => setJobData({ ...jobData, educationLevel: e.target.value })}
        />
        <label className="block mb-2 font-semibold">Minimum Years of Experience</label>

        <Input
          placeholder="Minimum Years of Experience"
          type="number"
          value={jobData.minExperienceYears || 0}
          onChange={(e) => setJobData({ ...jobData, minExperienceYears: Number(e.target.value) })}
        />
        <div>
          <label className="block mb-2 font-semibold">Select Skills</label>
          <CreatableSelect
            isMulti
            options={skillsOptions}
            getNewOptionData={(inputValue, label) => ({
              label,
              value: `new-${inputValue}`,
              __isNew__: true,  // This marks the option as a new entry
              data: { name: inputValue, proficiencyLevel: "Intermediate" }, // default
            })}
            onChange={(selected) => {
              const newSkills = selected.map(opt => opt.data);
              setSelectedSkills(newSkills);
            }}
            onCreateOption={(inputValue) => {
              setNewSkill({ name: inputValue, proficiencyLevel: "Intermediate" });
              setSkillModalOpen(true); // open modal to enter more info
            }}
          />
          
        </div>

        <div>
          <label className="block mb-2 font-semibold">Select Certifications</label>
          <CreatableSelect
            isMulti
            options={certificationOptions}
            getNewOptionData={(inputValue, label) => ({
              label,
              value: `new-${inputValue}`,
              __isNew__: true,  // This marks the option as a new entry
              data: { name: inputValue, provider: "" },
            })}
            onChange={(selected) => {
              const newCerts = selected.map(opt => opt.data);
              setSelectedCerts(newCerts);
            }}
            onCreateOption={(inputValue) => {
              setNewCert({ name: inputValue, provider: "" });
              setCertModalOpen(true);
            }}
          />
        </div>
  
        <Button onClick={handleSubmit} className="mt-4">Create Job</Button>
      </div>

      {/* Skill Modal */}
      <Modal isOpen={isSkillModalOpen} onClose={() => setSkillModalOpen(false)}>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add New Skill</h2>
          <Input placeholder="Skill Name" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} />
          <Input placeholder="Proficiency Level" value={newSkill.proficiencyLevel} onChange={e => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })} />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSkillModalOpen(false)}>Cancel</Button>
            <Button onClick={addSkill}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Certification Modal */}
      <Modal isOpen={isCertModalOpen} onClose={() => setCertModalOpen(false)}>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add New Certification</h2>
          <Input placeholder="Certification Name" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} />
          <Input placeholder="Provider" value={newCert.provider} onChange={e => setNewCert({ ...newCert, provider: e.target.value })} />
          <Input placeholder="Date Issued" value={newCert.dateIssued} onChange={e => setNewCert({ ...newCert, dateIssued: e.target.value })} />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setCertModalOpen(false)}>Cancel</Button>
            <Button onClick={addCert}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
