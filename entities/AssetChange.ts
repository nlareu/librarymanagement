/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AssetChangeType = "CREATE" | "UPDATE" | "DELETE";

export interface AssetChange {
  id: string;
  changeType: AssetChangeType;
  assetId: string;
  timestamp: string;
  oldData?: {
    title?: string;
    type?: string;
    description?: string;
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
    volumes?: string;
    copies?: string;
    isLoanable?: boolean;
    subjects?: string[];
    ibicSubjects?: string[];
  };
  newData?: {
    title?: string;
    type?: string;
    description?: string;
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
    volumes?: string;
    copies?: string;
    isLoanable?: boolean;
    subjects?: string[];
    ibicSubjects?: string[];
  };
  synced: boolean;
}
