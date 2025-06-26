import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { cvService } from "../../services";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { TrashBinIcon } from "../../icons";
import { Skills } from "../../../types/Skills";


interface Cv {
  id: number;
  name: string;
  emails: string[];
  phone: string[];
  age: number;
  linkedIn: string;
  nationality: string[];
  gender: string;
  workExperience: { jobTitle: string; company: string; startDate: string; endDate: string }[];
  cvEducation: { institution: string; degree: string; startDate: string; endDate: string }[];
  skills: Skills[];
  languages: { language: string; proficiency: string }[];
  certifications: { certificationName: string; issuingOrganization: string }[];
  hobbies: string[];
}
export default function CvTable({ refreshKey }: { refreshKey: number }) {
  const [cvData, setCvData] = useState<Cv[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCv, setSelectedCv] = useState<Cv | null>(null);
  const [searchSkill, setSearchSkill] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const navigate = useNavigate();  // Move this here

  const handleChange = (field: keyof Cv, value: any) => {
    if (!selectedCv) return;
    setSelectedCv({ ...selectedCv, [field]: value });
  };

  const handleDelete = async (cvId: number) => {
    try {
      await cvService.deleteCv(cvId);
      setCvData((prevData) => prevData.filter((cv) => cv.id !== cvId));
      console.log(`CV with ID ${cvId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  const handleNestedChange = (
    parent: keyof Cv,
    index: number,
    key: string,
    value: string
  ) => {
    if (!selectedCv || !Array.isArray(selectedCv[parent])) return;
    const updated = [...(selectedCv[parent] as any[])];
    updated[index] = { ...updated[index], [key]: value };
    setSelectedCv({ ...selectedCv, [parent]: updated });
  };

  const handleSave = () => {
    if (!selectedCv) return;
    console.log("Saving changes...", selectedCv);
    // TODO: send selectedCv to API here
    closeModal();
  };
  const filteredCvs = cvData.filter((cv) => {
    const matchesSearch =
      !searchSkill ||
      cv.skills.some((s) =>
        s.name.toLowerCase().includes(searchSkill.toLowerCase())
      );
    const matchesSelected =
      !selectedSkill || cv.skills.some((s) => s.name === selectedSkill);
    return matchesSearch && matchesSelected;
  });
  const handleViewProfile = (cvId: number) => {
    navigate(`/cv-profile/${cvId}`); // Now it should work correctly
  };
const allSkills = Array.from(
    new Set(cvData.flatMap((cv) => cv.skills.map((s) => s.name)))
  );
  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const data = await cvService.getAllCvs();
        setCvData(data);
      } catch (error) {
        console.error("Error fetching CVs:", error);
      }
    };

    fetchCvData();
    }, [refreshKey]);

  return (
        <>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end">
        <div>
          <input
            list="skill-suggestions"
            type="text"
            className="w-64 rounded-md border p-2 dark:bg-gray-800 dark:text-white"
            placeholder="Ex: Java, Python, React..."
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
          <datalist id="skill-suggestions">
            {allSkills.map((skill) => (
              <option key={skill} value={skill} />
            ))}
          </datalist>
        
        </div>
        
      </div>

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">Nom</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">Email</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">Télephone</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">LinkedIn</TableCell>
       
    
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredCvs.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell className="px-5 py-4 text-start">{cv.name}</TableCell>
                <TableCell className="px-5 py-4 text-start">{cv.emails[0]}</TableCell>
                <TableCell className="px-5 py-4 text-start">{cv.phone[0]}</TableCell>
                <TableCell className="px-5 py-4 text-start">
  <a
    href={cv.linkedIn}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    {cv.linkedIn}
  </a>
</TableCell>
                <TableCell className="px-5 py-4 text-start">
                   <Button
                   size="sm"
                    variant="primary"
                    onClick={() => handleViewProfile(cv.id)} // Navigate to the CV profile page
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-red px-4 py-3 text-sm font-medium text-gray-200 shadow-theme-xs hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white lg:inline-flex lg:w-auto"
                    >
                  Voir
                  </Button></TableCell>
          <TableCell className="px-5 py-4 text-start">
          <button 
               
                    onClick={() => handleDelete(cv.id)}

           className="flex items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-300"
  >
    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2h6v1H6V2Zm2 2h2v1h-2V4Zm5 2v8c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6H3v2h1v8c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V8h1V6h-2Z" fill="currentColor" />
    </svg>
    Delete
  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
        

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
  <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
    <div className="px-2 pr-14">
      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        Modifier Candidat pour {selectedCv?.name}
      </h4>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
        Modifier les information Personnel de Candidat.
      </p>
    </div>
    {selectedCv && (
      <form className="flex flex-col">
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div>
              <Label>Nom</Label>
              <Input
                type="text"
                value={selectedCv.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={selectedCv.emails[0] || ""}
                onChange={(e) =>
                  setSelectedCv({
                    ...selectedCv,
                    emails: [e.target.value, ...selectedCv.emails.slice(1)],
                  })
                }
              />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input
                type="text"
                value={selectedCv.phone[0] || ""}
                onChange={(e) =>
                  setSelectedCv({
                    ...selectedCv,
                    phone: [e.target.value, ...selectedCv.phone.slice(1)],
                  })
                }
              />
            </div>

            <div>
              <Label>LinkedIn</Label>
              <Input
                type="text"
                value={selectedCv.linkedIn}
                onChange={(e) => handleChange("linkedIn", e.target.value)}
              />
            </div>

            <div>
              <Label>Nationalité</Label>
              <Input
                type="text"
                value={selectedCv.nationality.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "nationality",
                    e.target.value.split(",").map((n) => n.trim())
                  )
                }
              />
            </div>

            <div>
              <Label>Compétences</Label>
              <Input
                type="text"
                value={selectedCv.skills.map((s) => s.name).join(", ")}
onChange={(e) =>
  handleChange(
    "skills",
    e.target.value.split(",").map((s) => ({ name: s.trim() }))
  )
}
/>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>
            fermer
          </Button>
          <Button size="sm" onClick={handleSave}>
            Sauvgarder
          </Button>
        </div>
      </form>
    )}
  </div>
</Modal>

      </div>
    </div>
    </>
  );
};
