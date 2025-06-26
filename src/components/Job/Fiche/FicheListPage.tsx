import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fichePosteService } from "../../../services/fichePosteService";
import { FichePoste } from "../../../../types/FichePoste";
import FichePosteGrid from "./FicheCard";
import Button from "../../ui/button/Button";
import PageMeta from "../../common/PageMeta";
import PageBreadcrumb from "../../common/PageBreadCrumb";
import { BoxIcon } from "../../../icons";

export default function FicheListPage() {
  const [fiches, setFiches] = useState<FichePoste[]>([]);
  const navigate = useNavigate();

  const fetchFiches = async () => {
    const res = await fichePosteService.getAll();
    setFiches(res);
  };

  useEffect(() => {
    fetchFiches(); // au chargement

    // à chaque retour sur l’onglet
    window.addEventListener("focus", fetchFiches);
    return () => {
      window.removeEventListener("focus", fetchFiches);
    };
  }, []);

  return (
    <>
      <PageMeta
        title="Liste des fiches de poste"
        description="Page de gestion des fiches de poste"
      />

      <PageBreadcrumb pageTitle="Fiches de poste" />

      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="primary"
            startIcon={<BoxIcon className="size-5" />}
            onClick={() => navigate("/fiches/new")}
          >
            Ajouter une fiche
          </Button>
        </div>
              <FichePosteGrid  />
      </div>
    </>
  );
}
