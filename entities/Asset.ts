/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Asset {
  id: string;
  title: string;
  type: string; // Corresponds to Formato
  description: string;

  // New fields from image
  registrationNumber?: string;
  signature?: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  publicationPlace?: string;
  edition?: string;
  publicationYear?: string;
  collectionTitle?: string;
  collectionNumber?: string;
  volumes?: number;
  copies?: number;
  isLoanable?: boolean;
  subjects?: string[]; // Materias
  ibicSubjects?: string[]; // Temas (Submaterias IBIC)
}
