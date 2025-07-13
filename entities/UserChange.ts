/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserChangeType = "CREATE" | "UPDATE" | "DELETE";

export interface UserChange {
  id: string;
  changeType: UserChangeType;
  userId: string;
  timestamp: string;
  oldData?: {
    userCode?: string;
    name?: string;
    lastName?: string;
    type?: string;
    grade?: string;
  };
  newData?: {
    userCode?: string;
    name?: string;
    lastName?: string;
    type?: string;
    grade?: string;
  };
  synced: boolean;
}
