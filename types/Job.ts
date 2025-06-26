import { Experience } from './Experience';
import { Education } from './Education';
import { Skills }from './Skills';
import { Certification } from './certification';
import { FichePoste } from './FichePoste';
export type Job ={
  id?: number;
  title: string;
  description: string;
  location: string;
  requiredSkills: Skills[];
  requiredCertifications: Certification[];
  educationLevel: string;
  minExperienceYears: number;
ficheDePoste?: FichePoste; 
   datePublication?: string;
     dateExpiration?: string;
}
