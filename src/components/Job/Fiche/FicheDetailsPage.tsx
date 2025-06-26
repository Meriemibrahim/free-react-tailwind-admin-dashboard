import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fichePosteService } from "../../../services/fichePosteService";
import { FichePoste } from "../../../../types/FichePoste";
import PageMeta from "../../common/PageMeta";
import PageBreadcrumb from "../../common/PageBreadCrumb";

import FichePostedetailsCard from "./FichePostedetailsCard";

export default function FicheDetailsPage() {
  const { id } = useParams();
  const [fiche, setFiche] = useState<FichePoste | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fichePosteService.getById(id!).then(setFiche);
  }, [id]);

  if (!fiche) return <p>Chargement…</p>;

  return (
    <>
      <PageMeta title={`Détails Fiche Poste - ${fiche.title}`} description="Détail complet de la fiche de poste" />
      <PageBreadcrumb pageTitle="Fiche de poste" />

      <div className="p-6 space-y-6">
     <FichePostedetailsCard
  fiche={fiche}
  onUpdate={(updated) => setFiche(updated)}
  onDelete={() => navigate("/fiches")} // ou autre action
/>

   

     

        

     
      </div>
    </>
  );
}
