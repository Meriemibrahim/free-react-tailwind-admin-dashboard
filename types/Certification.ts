import { Cv } from "./Cv";

export type Certification ={
  id?: number;
  name: string;
  provider: string;

  dateIssued?: string;
  cvs?: Cv[];
  
  }
  