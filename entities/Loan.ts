/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ActiveLoan {
  id: string;
  assetId: string;
  assetTitle: string;
  userId: string;
  userName: string;
  borrowDate: string; // ISO string
}

export interface LoanHistoryRecord {
    id: string;
    assetId: string;
    assetTitle: string;
    userId: string;
    userName: string;
    borrowDate: string; // ISO string
    returnDate: string; // ISO string
}
