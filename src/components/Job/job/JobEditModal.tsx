import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import CreatableSelect from "react-select/creatable";
import { jobService, certificationService, SkillService } from "../../../services";
import { Job } from "../../../../types/Job";
import { Skills } from "../../../../types/Skills";
import { Certification } from "../../../../types/certification";

type Props = {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
};

export const JobEditModal = ({ job, isOpen, onClose, onSave }: Props) => {
  const [skills, setSkills] = useState<Skills[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skills[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<Certification[]>([]);
  const [newSkill, setNewSkill] = useState<Skills>({ name: "", proficiencyLevel: "" });
  const [newCert, setNewCert] = useState<Certification>({ name: "", provider: "" });
  const [jobData, setJobData] = useState<Job>(job);

  const [isSkillModalOpen, setSkillModalOpen] = useState(false);
  const [isCertModalOpen, setCertModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJobData(job); // Initialize form values when modal opens
      setSelectedSkills(job.requiredSkills || []);
      setSelectedCerts(job.requiredCertifications || []);
      SkillService.getAllSkills().then(setSkills);
      certificationService.getAll().then(setCertifications);
    }
  }, [isOpen, job]);

  const handleSave = async () => {
    // Validate required fields before saving
    if (!jobData.title || !jobData.location || !selectedSkills.length || !selectedCerts.length || jobData.minExperienceYears <= 0) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedJob = {
      ...jobData,
      requiredSkills: selectedSkills,
      requiredCertifications: selectedCerts,
    };

    if (updatedJob.id) {
      await jobService.update(updatedJob.id, updatedJob);  // pass jobId as first argument
    }

    onSave(updatedJob);
    onClose();
  };

  const addSkill = async () => {
    const saved = await SkillService.createSkill(newSkill);
    if (!saved) return;

    setSkills((prev) => [...prev, saved]);
    setSelectedSkills((prev) => [...prev, saved]);
    setNewSkill({ name: "", proficiencyLevel: "" });
    setSkillModalOpen(false);
  };

  const addCert = async () => {
    const saved = await certificationService.create(newCert);
    setCertifications((prev) => [...prev, saved]);
    setSelectedCerts((prev) => [...prev, saved]);
    setNewCert({ name: "", provider: "" });
    setCertModalOpen(false);
  };

  const skillsOptions = skills.map((skill) => ({
    label: skill.name,
    value: skill.id?.toString(),
    data: skill,
  }));

  const certificationOptions = certifications.map((cert) => ({
    label: cert.name,
    value: cert.id?.toString(),
    data: cert,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Edit Job</h2>
        <Input
          placeholder="Job Title"
          value={jobData.title}
          onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
        />
        <Input
          placeholder="Location"
          value={jobData.location}
          onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
        />
        <Input
          placeholder="Job Description"
          value={jobData.description}
          onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
        />
        <Input
          placeholder="Education Level"
          value={jobData.educationLevel || ""}
          onChange={(e) => setJobData({ ...jobData, educationLevel: e.target.value })}
        />
        <Input
          placeholder="Minimum Years of Experience"
          type="number"
          value={jobData.minExperienceYears || 0}
          onChange={(e) => setJobData({ ...jobData, minExperienceYears: Number(e.target.value) })}
        />
        <CreatableSelect
          isMulti
          options={skillsOptions}
          value={selectedSkills.map((skill) => ({
            label: skill.name,
            value: skill.id?.toString(),
            data: skill,
          }))}
          onChange={(selected) => {
            const updatedSkills = selected.map((opt) => opt.data);
            setSelectedSkills(updatedSkills);
          }}
          onCreateOption={(inputValue) => {
            setNewSkill({ name: inputValue, proficiencyLevel: "Intermediate" });
            setSkillModalOpen(true);
          }}
        />
        <CreatableSelect
          isMulti
          options={certificationOptions}
          value={selectedCerts.map((cert) => ({
            label: cert.name,
            value: cert.id?.toString(),
            data: cert,
          }))}
          onChange={(selected) => {
            const updatedCerts = selected.map((opt) => opt.data);
            setSelectedCerts(updatedCerts);
          }}
          onCreateOption={(inputValue) => {
            setNewCert({ name: inputValue, provider: "" });
            setCertModalOpen(true);
          }}
        />
        <Button onClick={handleSave}>Save</Button>
      </div>

      {/* Skill Modal */}
      <Modal isOpen={isSkillModalOpen} onClose={() => setSkillModalOpen(false)}>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add New Skill</h2>
          <Input
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          <Input
            placeholder="Proficiency Level"
            value={newSkill.proficiencyLevel}
            onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })}
          />
          <Button onClick={addSkill}>Save</Button>
        </div>
      </Modal>

      {/* Certification Modal */}
      <Modal isOpen={isCertModalOpen} onClose={() => setCertModalOpen(false)}>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add New Certification</h2>
          <Input
            placeholder="Certification Name"
            value={newCert.name}
            onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
          />
          <Input
            placeholder="Provider"
            value={newCert.provider}
            onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
          />
          <Button onClick={addCert}>Save</Button>
        </div>
      </Modal>
    </Modal>
  );
};
