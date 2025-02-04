import {Actor} from "./actor";
import {Category} from "./category";

export interface Film {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  languageId: number;
  language: string;
  originalLanguageId: number;
  originalLanguage: string;
  rentalDuration: number;
  rentalRate: number;
  length: number;
  replacementCost: number;
  rating: 'G' | 'PG' | 'PG13' | 'R' | 'NC17';
  specialFeatures: string;
  lastUpdate: string;
  actors: Actor[];
  categories: Category[];
}
