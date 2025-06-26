import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { SkillService } from "../../services";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Skills } from "../../../types/Skills";
import Select from "../../components/form/Select";


export default function SkillsTable() {
  const [skills, setSkills] = useState<Skills[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [newSkill, setNewSkill] = useState({ name: "", proficiencyLevel: "" });
  const [editingSkill, setEditingSkill] = useState<Skills | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Skills | "cvCount"; direction: "asc" | "desc" } | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>("");
  const { isOpen, openModal, closeModal } = useModal();
const SKILL_LEVELS = [
  { value: "Beginner", label: "Débutant" },
  { value: "Intermediate", label: "Intermédiaire" },
  { value: "Advanced", label: "Avancé" },
];
  // Delete confirmation modal state
  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();
  const [skillToDelete, setSkillToDelete] = useState<Skills | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state (basic example)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // reset page on new search
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SkillService.getAllSkills();
      setSkills(res);
    } catch (err) {
      setError("Erreur lors du chargement des compétences");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleDeleteConfirmed = async () => {
    if (!skillToDelete) return;
    setLoading(true);
    setError(null);
    try {
        if(skillToDelete.id){
      await SkillService.deleteSkill(skillToDelete.id);
      setSkillToDelete(null);
      closeConfirm();
      fetchSkills();}
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (skill: Skills) => {
    setSkillToDelete(skill);
    openConfirm();
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editingSkill?.id) {
        await SkillService.updateSkill({ ...newSkill, id: editingSkill.id });
      } else {
        await SkillService.createSkill(newSkill);
      }
      fetchSkills();
      closeModal();
      setNewSkill({ name: "", proficiencyLevel: "" });
      setEditingSkill(null);
    } catch (err) {
      setError("Erreur lors de l’enregistrement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedSkills = useMemo(() => {
    let sortableSkills = [...skills];

    sortableSkills.forEach(s => {
      if (!s.cvs) s.cvs = [];
    });

    if (sortConfig !== null) {
      sortableSkills.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";
        if (sortConfig.key === "cvCount") {
          aValue = a.cvs?.length ?? 0;
          bValue = b.cvs?.length ?? 0;
        } else {
          aValue = (a[sortConfig.key] ?? "").toString().toLowerCase();
          bValue = (b[sortConfig.key] ?? "").toString().toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableSkills;
  }, [skills, sortConfig]);

  const filteredSkills = useMemo(() => {
    return sortedSkills.filter(
      (s) =>
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        (filterLevel === "" || s.proficiencyLevel === filterLevel)
    );
  }, [sortedSkills, debouncedSearch, filterLevel]);

  // Pagination slice
  const pagedSkills = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSkills.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSkills, currentPage]);

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);

  const requestSort = (key: keyof Skills | "cvCount") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const exportCsv = () => {
    const headers = ["Nom", "Niveau", "Nombre de CV"];
    const rows = filteredSkills.map((s) => [
      `"${s.name}"`,
      `"${s.proficiencyLevel}"`,
      s.cvs?.length ?? 0,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "competences.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "advanced":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "beginner":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 

        <Label htmlFor="filterLevel" className="sr-only">
          Filtrer par niveau
        </Label>
        <select
          id="filterLevel"
          className="rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          aria-label="Filtrer par niveau de compétence"
        >
          <option value="">Niveaux</option>
         {SKILL_LEVELS.map((level) => (
  <option key={level.value} value={level.value}>
    {level.label}
  </option>
))}

        </select>
 <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
    value={search}
        onChange={(e) => setSearch(e.target.value)}
    list="skills-list"

                  placeholder="Search or type command..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />
      <datalist id="skills-list">
          {skills.map((skill) => (
            <option key={skill.id} value={skill.name} />
          ))}
        </datalist>
                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
        <Button onClick={openModal}>Ajouter compétence</Button>
      
      </div>

      {loading && (
        <div role="status" aria-live="polite" className="mb-4 text-center text-gray-500">
          Chargement en cours...
        </div>
      )}

      {error && (
        <div role="alert" className="mb-4 text-center text-red-600 font-semibold">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <th
                  onClick={() => requestSort("name")}
                  className="cursor-pointer px-5 py-3 font-medium text-start text-gray-500"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") requestSort("name");
                  }}
                  aria-sort={
                    sortConfig?.key === "name"
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Nom {sortConfig?.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  onClick={() => requestSort("proficiencyLevel")}
                  className="cursor-pointer px-5 py-3 font-medium text-start text-gray-500"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") requestSort("proficiencyLevel");
                  }}
                  aria-sort={
                    sortConfig?.key === "proficiencyLevel"
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Niveau {sortConfig?.key === "proficiencyLevel" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  onClick={() => requestSort("cvCount")}
                  className="cursor-pointer px-5 py-3 font-medium text-start text-gray-500"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") requestSort("cvCount");
                  }}
                  aria-sort={
                    sortConfig?.key === "cvCount"
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Candidats accordée {sortConfig?.key === "cvCount" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-5 py-3 font-medium text-start text-gray-500"
                >
                   
                </th>
                 <th
                  className="px-5 py-3 font-medium text-start text-gray-500"
                >
                  <Button onClick={exportCsv} variant="outline" disabled={loading}>
          📤 Export CSV
        </Button>   
                </th>
              
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {pagedSkills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="px-5 py-4 text-start">{skill.name}</TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-sm font-semibold ${getBadgeColor(
                        skill.proficiencyLevel
                      )}`}
                    >
                      {skill.proficiencyLevel}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">{skill.cvCount?? 0}</TableCell>
                  <TableCell className="px-5 py-4 text-start space-x-2">
                    <button
                      onClick={() => {
                        setEditingSkill(skill);
                        setNewSkill({
                          name: skill.name,
                          proficiencyLevel: skill.proficiencyLevel,
                        });
                        openModal();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                      {/* SVG icon */}
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
                                      </TableCell>

                  <TableCell className="px-5 py-4 text-start space-x-2">

                    <button
                      onClick={() => handleDeleteClick(skill)}
                      className="flex items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-300"
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
                          d="M6 2h6v1H6V2Zm2 2h2v1h-2V4Zm5 2v8c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6H3v2h1v8c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V8h1V6h-2Z"
                          fill="currentColor"
                        />
                      </svg>
                      Supprimer
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSkills.length === 0 && !loading && (
                <TableRow>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Aucune compétence trouvée.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Précédent
          </Button>
          <span className="flex items-center px-3">{`${currentPage} / ${totalPages}`}</span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Modal add/edit */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {editingSkill ? "Modifier" : "Ajouter"} Compétence
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {editingSkill
                ? "Modifiez les détails de cette compétence."
                : "Ajoutez une nouvelle compétence à la base."}
            </p>
          </div>
          <form
            className="flex flex-col space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div>
              <Label htmlFor="skillName">Nom</Label>
              <Input
                id="skillName"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                
              />
            </div>
            <div>
              <Label htmlFor="skillLevel">Niveau</Label>
             <Select
  options={SKILL_LEVELS}
  placeholder="Sélectionner un niveau"
  defaultValue={newSkill.proficiencyLevel}
  onChange={(value: string) =>
    setNewSkill({ ...newSkill, proficiencyLevel: value })
  }
/>

            </div>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeModal} disabled={loading}>
                Annuler
              </Button>
              <Button  disabled={loading}>
                {editingSkill ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Confirm delete modal */}
      <Modal isOpen={isConfirmOpen} onClose={closeConfirm} className="max-w-sm m-4">
        <div className="p-6 bg-white rounded-lg dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Confirmer la suppression
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Voulez-vous vraiment supprimer la compétence{" "}
            <strong>{skillToDelete?.name}</strong> ?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeConfirm} disabled={loading}>
              Annuler
            </Button>
            <Button onClick={handleDeleteConfirmed} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
