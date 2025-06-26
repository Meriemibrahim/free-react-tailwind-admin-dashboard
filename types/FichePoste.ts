import { Skills } from "./Skills";
import { Certification } from "./certification";
import { Job } from "./Job";

export type TypeContrat = "CDI" | "CDD" | "STAGE" | "INTERIM";
export type TypeTempsTravail = "TEMPS_PLEIN" | "TEMPS_PARTIEL";

export interface FichePoste {
  id?: number;
  title: string;
  description: string;
  workplace: string;
  worktime: TypeTempsTravail;
  mission: string;
  positionH: string;
  typeContrat: TypeContrat;
  requiredSkills: Skills[];
  requiredCertifications: Certification[];
  pdfFile?: string; // URL Cloudinary ou nom local
  minExperienceYears: number;
  educationLevel: number;
  offres?: Job[]; // Offres créées à partir de cette fiche
}
