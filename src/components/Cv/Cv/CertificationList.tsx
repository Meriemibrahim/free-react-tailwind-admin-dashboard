import React, { useEffect, useState } from "react";
import CertificationCard from "./CertificationCard";
import { Certification } from "../../../../types/certification";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Modal } from "../../ui/modal";
import Alert from "../../ui/alert/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Ici tu importes ton service de certification (à adapter)
import { certificationService } from "../../../services";

type Props = {
  cvId: number;
  initialCertifications: Certification[];
};

const CertificationList: React.FC<Props> = ({ cvId, initialCertifications }) => {
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [allCertifications, setAllCertifications] = useState<Certification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificationId, setSelectedCertificationId] = useState<number | null>(null);

  const [newCertName, setNewCertName] = useState("");
  const [newCertProvider, setNewCertProvider] = useState("");
  const [newCertDate, setNewCertDate] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editCert, setEditCert] = useState<Certification | null>(null); // état pour la cert modifiée
const [selectedDate, setSelectedDate] = useState<Date | null>(
  editCert?.dateIssued ? new Date(editCert.dateIssued) : null
);

// Mettre à jour la date dans l'édition et dans selectedDate
const onDateChange = (date: Date | null) => {
  setSelectedDate(date);
  handleEditChange("dateIssued", date ? date.toISOString().slice(0, 10) : "");
};
  useEffect(() => {
    certificationService.getAll().then(setAllCertifications);
  }, []);

  const filteredCertifications = allCertifications.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCertification = () => {
    if (selectedCertificationId) {
      const selected = allCertifications.find((c) => c.id === selectedCertificationId);
      if (selected) {
        certificationService.affectToCv(cvId, selected.id!).then(() => {
          setCertifications((prev) => [...prev, selected]);
          setSuccessMessage("Certification ajoutée avec succès");
          setTimeout(() => setSuccessMessage(null), 3000);
          setIsAddOpen(false);
          setSelectedCertificationId(null);
          setSearchTerm("");
        });
      }
    } else if (newCertName && newCertProvider) {
      certificationService.create({
        name: newCertName,
        provider: newCertProvider,
        dateIssued: newCertDate || undefined,
      }).then((created) => {
        certificationService.affectToCv(cvId, created.id!).then(() => {
          setCertifications((prev) => [...prev, created]);
          setSuccessMessage("Nouvelle certification ajoutée");
          setTimeout(() => setSuccessMessage(null), 3000);
          setIsAddOpen(false);
          setNewCertName("");
          setNewCertProvider("");
          setNewCertDate("");
        });
      });
    }
  };

  const handleRemove = (id: number) => {
    if (window.confirm("Retirer cette certification du CV ?")) {
      certificationService.unaffectFromCv(cvId, id).then(() => {
        setCertifications((prev) => prev.filter((c) => c.id !== id));
        setSuccessMessage("Certification retirée");
        setTimeout(() => setSuccessMessage(null), 3000);
      });
    }
  };
const handleEdit = (cert: Certification) => {
  setEditCert(cert);
  setSelectedDate(cert.dateIssued ? new Date(cert.dateIssued) : null);
  setIsEditOpen(true);
};


  // Modal open pour édition
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Mise à jour de la certification
  const handleUpdateCertification = () => {
    if (!editCert) return;

    certificationService.update(editCert.id!, {
      name: editCert.name,
      provider: editCert.provider,
      dateIssued: editCert.dateIssued,
    }).then((updated) => {
      setCertifications((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setSuccessMessage("Certification mise à jour avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsEditOpen(false);
      setEditCert(null);
    });
  };

  // Gestion des champs modifiables dans le modal
  const handleEditChange = (field: keyof Certification, value: string) => {
    if (!editCert) return;
    
    setEditCert({ ...editCert, [field]: value });
  };
  return (
 
   <div className="mb-6">
<div className="flex items-center justify-start gap-6 mb-4">
  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Certifications</h4>
  <button
    onClick={() => setIsAddOpen(true)}
    className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
  >
    <span className="inline-block w-5 h-5 text-gray-700 dark:text-gray-400 font-bold select-none">+</span>
    Ajouter une certification
  </button>
</div>
      {successMessage && <Alert variant="success" title="Succès" message={successMessage} showLink={false} />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert) => (
          <CertificationCard key={cert.id} certification={cert} onRemove={handleRemove}  onEdit={handleEdit} />
        ))}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} className="max-w-md">
        <div className="p-6">
          <h4 className="text-lg font-semibold mb-4">Ajouter une certification</h4>

          <Input
            placeholder="Rechercher une certification existante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredCertifications.length > 0 ? (
            <ul className="mt-4 max-h-48 overflow-auto space-y-2">
              {filteredCertifications.map((c) => (
                <li
                  key={c.id}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer ${
                    selectedCertificationId === c.id
                      ? "bg-blue-100 dark:bg-blue-900 font-semibold text-blue-600 dark:text-blue-400"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                  onClick={() => setSelectedCertificationId(c.id!)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 space-y-3 border border-dashed border-gray-300 rounded-lg p-4 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Aucune certification trouvée. Ajouter une nouvelle :</p>
              <Label>Nom</Label>
              <Input value={newCertName} onChange={(e) => setNewCertName(e.target.value)} />
              <Label>Fournisseur</Label>
              <Input value={newCertProvider} onChange={(e) => setNewCertProvider(e.target.value)} />
               <Label>Date d’émission</Label>
 <DatePicker
        selected={selectedDate}
  onChange={(date: Date | null) => {
    setSelectedDate(date);
    setNewCertDate(date ? date.toISOString().slice(0, 10) : "");
  }}
       dateFormat="yyyy-MM-dd"
        className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        isClearable
        placeholderText="Sélectionnez une date"
      />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCertification}>Ajouter</Button>
          </div>
        </div>
      </Modal>
      {/* Modal édition */}
<Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-md">
  <div className="p-6">
    <h4 className="text-lg font-semibold mb-4">Modifier la certification</h4>

    <Label>Nom</Label>
    <Input
      value={editCert?.name || ""}
      disabled
    />

    <Label>Fournisseur</Label>
    <Input
      value={editCert?.provider || ""}
      onChange={(e) => handleEditChange("provider", e.target.value)}
    />

    <Label>Date d’émission</Label>
 <DatePicker
        selected={selectedDate}
  onChange={(date: Date | null) => {
    const dateString = date ? date.toISOString().slice(0, 10) : "";
    handleEditChange("dateIssued", dateString);
    setSelectedDate(date);
  }}
      dateFormat="yyyy-MM-dd"
        className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        isClearable
        placeholderText="Sélectionnez une date"
      />

    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={() => setIsEditOpen(false)}>
        Annuler
      </Button>
      <Button onClick={handleUpdateCertification}>Enregistrer</Button>
    </div>
  </div>
</Modal>

    </div>
  );
};

export default CertificationList;
