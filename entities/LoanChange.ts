/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LoanChangeType = "CREATE" | "DELETE";

export interface LoanChange {
  id: string;
  changeType: LoanChangeType;
  loanId: string;
  timestamp: string;
  oldData?: {
    assetId: string;
    assetTitle: string;
    userId: string;
    userName: string;
    borrowDate: string;
  };
  newData?: {
    assetId: string;
    assetTitle: string;
    userId: string;
    userName: string;
    borrowDate: string;
  };
  synced: boolean;
}
