import { Experience } from './Experience';
import { Education } from './Education';
import { Skills }from './Skills';
import { Certification } from './certification';
import { CandidateStatus } from './CandidateStatus';

export type Cv ={
  id?: number;
  name: string;
  emails: string[];
  phone: string[];
  age: number | null;
  linkedIn: string;
  nationality: string[];
  gender: string;
photoUrl: string;
cvFileUrl: string;
  workExperience: Experience[];
  cvEducation: Education[];
  skills: Skills[];

  languages: Record<string, string>;
  certifications: Certification[];
  hobbies: Record<string, string>;
  status?: CandidateStatus | null;
}
