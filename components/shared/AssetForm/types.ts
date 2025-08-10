/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AssetFormData {
  title?: string;
  type?: string;
  description?: string;

  // New fields
  registrationNumber?: string;
  signature?: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  publicationPlace?: string;
  edition?: string;
  publicationYear?: string; // Use string for form input
  collectionTitle?: string;
  collectionNumber?: string;
  volumes?: string;
  copies?: string;
  isLoanable?: boolean;
  subjects?: string[];
  ibicSubjects?: string[];
}
