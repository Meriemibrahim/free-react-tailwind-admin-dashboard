import { Cv } from "./Cv";

export type Skills ={
  id?: number;
  name: string;
  proficiencyLevel: string;
  cvs?: Cv[];
  cvCount?: number;
  }
  