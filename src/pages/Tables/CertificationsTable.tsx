import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { certificationService } from "../../services"; // à adapter selon ton service réel
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { Certification } from "../../../types/certification";

const CertificationTable: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [newCert, setNewCert] = useState<Certification>({ name: "", provider: "", dateIssued: "" });
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Certification | "cvCount"; direction: "asc" | "desc" } | null>(null);
  const [filterProvider, setFilterProvider] = useState<string>("");
  const { isOpen, openModal, closeModal } = useModal();

  const { isOpen: isConfirmOpen, openModal: openConfirm, closeModal: closeConfirm } = useModal();
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch certifications from API/service
  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await certificationService.getAll();
      setCertifications(res);
    } catch (err) {
      setError("Erreur lors du chargement des certifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  // Delete handler
  const handleDeleteConfirmed = async () => {
    if (!certToDelete) return;
    setLoading(true);
    setError(null);
    try {
      if (certToDelete.id) {
        await certificationService.delete(certToDelete.id);
        setCertToDelete(null);
        closeConfirm();
        fetchCertifications();
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (cert: Certification) => {
    setCertToDelete(cert);
    openConfirm();
  };

  // Save handler (create/update)
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editingCert?.id) {
await certificationService.update(editingCert.id, newCert);
      } else {
        await certificationService.create(newCert);
      }
      fetchCertifications();
      closeModal();
      setNewCert({ name: "", provider: "", dateIssued: "" });
      setEditingCert(null);
    } catch (err) {
      setError("Erreur lors de l’enregistrement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sorting logic
  const sortedCerts = useMemo(() => {
    let sortableCerts = [...certifications];
    sortableCerts.forEach((c) => {
      if (!c.cvs) c.cvs = [];
    });

    if (sortConfig !== null) {
      sortableCerts.sort((a, b) => {
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
    return sortableCerts;
  }, [certifications, sortConfig]);

  // Filter by search and provider
  const filteredCerts = useMemo(() => {
    return sortedCerts.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        (filterProvider === "" || c.provider === filterProvider)
    );
  }, [sortedCerts, debouncedSearch, filterProvider]);

  // Pagination slice
  const pagedCerts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCerts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCerts, currentPage]);

  const totalPages = Math.ceil(filteredCerts.length / ITEMS_PER_PAGE);

  const requestSort = (key: keyof Certification | "cvCount") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Export CSV function
  const exportCsv = () => {
    const headers = ["Nom", "Fournisseur", "Date d'émission", "Nombre de CV"];
    const rows = filteredCerts.map((c) => [
      `"${c.name}"`,
      `"${c.provider}"`,
      `"${c.dateIssued ?? ""}"`,
      c.cvs?.length ?? 0,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "certifications.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
   

     

    
      </div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

   <Label htmlFor="filterProvider" className="sr-only">
          Filtrer par fournisseur
        </Label>
        <select
          id="filterProvider"
          className="rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
          value={filterProvider}
          onChange={(e) => setFilterProvider(e.target.value)}
          aria-label="Filtrer par fournisseur"
        >
          <option value="">Fournisseurs</option>
          {[...new Set(certifications.map((c) => c.provider))].map((provider) => (
            <option key={provider} value={provider}>
              {provider}
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
    list="certifications-list"

                  placeholder="Search or type command..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />
  <datalist id="certifications-list">
    {certifications.map((cert) => (
      <option key={cert.id} value={cert.name} />
    ))}
  </datalist>
                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
 



                <Button onClick={openModal}>Ajouter certification</Button>

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
                  onClick={() => requestSort("provider")}
                  className="cursor-pointer px-5 py-3 font-medium text-start text-gray-500"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") requestSort("provider");
                  }}
                  aria-sort={
                    sortConfig?.key === "provider"
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Fournisseur {sortConfig?.key === "provider" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  onClick={() => requestSort("dateIssued")}
                  className="cursor-pointer px-5 py-3 font-medium text-start text-gray-500"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") requestSort("dateIssued");
                  }}
                  aria-sort={
                    sortConfig?.key === "dateIssued"
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Date d'émission {sortConfig?.key === "dateIssued" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
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
                  Candidats associés {sortConfig?.key === "cvCount" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-5 py-3 font-medium text-start text-gray-500"></th>
                <th className="px-5 py-3 font-medium text-start text-gray-500">    <Button onClick={exportCsv} variant="outline" disabled={loading}>
          📤 Export CSV
        </Button></th>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {pagedCerts.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="px-5 py-4 text-start">{cert.name}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cert.provider}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cert.dateIssued ?? "-"}</TableCell>
                  <TableCell className="px-5 py-4 text-start">{cert.cvs?.length ?? 0}</TableCell>

                  <TableCell className="px-5 py-4 text-start space-x-2">
                    <button
                      onClick={() => {
                        setEditingCert(cert);
                        setNewCert({
                          name: cert.name,
                          provider: cert.provider,
                          dateIssued: cert.dateIssued ?? "",
                        });
                        openModal();
                      }}
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
                  </TableCell>

                  <TableCell className="px-5 py-4 text-start space-x-2">
                    <button
                      onClick={() => handleDeleteClick(cert)}
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
                  </TableCell>
                </TableRow>
              ))}
              {filteredCerts.length === 0 && !loading && (
                <TableRow>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Aucune certification trouvée.
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
)}  {/* Modal Add/Edit */}
  <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md m-4">
    <div className="p-6 bg-white rounded-lg dark:bg-gray-900">
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {editingCert ? "Modifier" : "Ajouter"} une certification
      </h3>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <Label htmlFor="certName">Nom</Label>
          <Input
            id="certName"
            value={newCert.name}
            onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="provider">Fournisseur</Label>
          <Input
            id="provider"
            value={newCert.provider}
            onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="dateIssued">Date d’émission</Label>
          <Input
            id="dateIssued"
            type="date"
            value={newCert.dateIssued ?? ""}
            onChange={(e) => setNewCert({ ...newCert, dateIssued: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={closeModal} disabled={loading}>
            Annuler
          </Button>
          <Button  disabled={loading}>
            {editingCert ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </form>
    </div>
  </Modal>

  {/* Modal Confirm Delete */}
  <Modal isOpen={isConfirmOpen} onClose={closeConfirm} className="max-w-sm m-4">
    <div className="p-6 bg-white rounded-lg dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Confirmer la suppression
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Voulez-vous vraiment supprimer la certification{" "}
        <strong>{certToDelete?.name}</strong> ?
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
};

export default CertificationTable;
