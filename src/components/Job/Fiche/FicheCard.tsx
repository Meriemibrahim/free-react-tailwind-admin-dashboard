import { useNavigate } from "react-router-dom";
import { FichePoste } from "../../../../types/FichePoste";
import ComponentCard from "../../common/ComponentCard";
import { fichePosteService } from "../../../services/fichePosteService";
import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";

export default function FichePosteGrid() {
  const [fiches, setFiches] = useState<FichePoste[]>();
  const [ficheToDelete, setFicheToDelete] = useState<FichePoste | null>(null);
  const navigate = useNavigate();

  const fetchFiches = async () => {
    const res = await fichePosteService.getAll();
    setFiches(res);
  };

  function confirmDelete() {
    if (ficheToDelete?.id) {
      fichePosteService.delete(ficheToDelete.id).then(() => {
        setFiches((prev) => prev?.filter((f) => f.id !== ficheToDelete.id));
        setFicheToDelete(null);
      });
    }
  }

  useEffect(() => {
    fetchFiches();
    window.addEventListener("focus", fetchFiches);
    return () => {
      window.removeEventListener("focus", fetchFiches);
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {fiches?.map((fiche) => (
          <ComponentCard title={fiche.title} key={fiche.id}>
            <div>
              {fiche.pdfFile ? (
                <div
                  onClick={() => navigate(`/fiches/${fiche.id}`)}
                  className="overflow-hidden h-32 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <img
                    src={`https://res.cloudinary.com/dco4c4ipo/image/upload/pg_1,f_png,w_400,c_scale/fiches_poste/fiche_${fiche.id}.pdf`}
                    alt={`Preview fiche ${fiche.title}`}
                    className="w-full object-cover"
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">PDF en cours de génération…</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setFicheToDelete(fiche)}
                  className="flex items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-300"
                >
                  {/* Icon Supprimer */}
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2h6v1H6V2Zm2 2h2v1h-2V4Zm5 2v8c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6H3v2h1v8c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V8h1V6h-2Z"
                      fill="currentColor"
                    />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          </ComponentCard>
        ))}
      </div>

      {ficheToDelete && (
     
          <Modal isOpen={true} onClose={() => setFicheToDelete(null)} className="max-w-sm m-4">
            <div className="p-6 bg-white rounded-lg dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Confirmer la suppression
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Voulez-vous vraiment supprimer la certification{" "}
                <strong>{ficheToDelete?.title}</strong> ?
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline"  onClick={() => setFicheToDelete(null)} >
                  Annuler
                </Button>
                <Button onClick={confirmDelete}  className="bg-red-600 hover:bg-red-700 text-white">
                  Supprimer
                </Button>
              </div>
            </div>
          </Modal>
      )}
    </>
  );
}
