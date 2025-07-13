/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import {
  fetchUserDataSpreadsheet,
  syncUserChangesToUserDataSpreadsheet,
} from "../../../data/spreadsheet";
import { saveUsers } from "../../../data/db";
import {
  getPendingUserChanges,
  markUserChangesSynced,
} from "../../../data/api";
import type { User } from "../../../entities/User";
import "./SyncView.css";
import { messages } from "./messages";

export function SyncView() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSyncDown = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingDown);
    setErrorMessage("");

    try {
      const spreadsheetData = await fetchUserDataSpreadsheet();

      if (spreadsheetData.rows.length === 0) {
        setSyncStatus(messages.noDataFound);
        return;
      }

      // Convert spreadsheet data to User objects
      const users: User[] = spreadsheetData.rows.map((row) => ({
        id: row.id || crypto.randomUUID(),
        userCode: row.userCode || "",
        name: row.name || "",
        lastName: row.lastName || "",
        type: (row.type as User["type"]) || "Estudiante",
        grade: row.grade || undefined,
      }));

      // Save to local storage
      saveUsers(users);
      setSyncStatus(
        messages.syncDownComplete.replace("{count}", users.length.toString())
      );
    } catch (error) {
      console.error("Error syncing down:", error);
      setErrorMessage(messages.syncDownError + ": " + (error as Error).message);
      setSyncStatus("");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncUp = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingUp);
    setErrorMessage("");

    try {
      const pendingChanges = getPendingUserChanges();

      if (pendingChanges.length === 0) {
        setSyncStatus(messages.noPendingChanges);
        return;
      }

      // Convert changes to spreadsheet format
      const changesToSync = pendingChanges.map((change) => ({
        changeType: change.changeType,
        userId: change.userId,
        userData: change.newData
          ? {
              id: change.userId,
              userCode: change.newData.userCode || "",
              name: change.newData.name || "",
              lastName: change.newData.lastName || "",
              type: change.newData.type || "",
              grade: change.newData.grade || "",
            }
          : undefined,
      }));

      await syncUserChangesToUserDataSpreadsheet(changesToSync);

      // Mark changes as synced
      const changeIds = pendingChanges.map((change) => change.id);
      markUserChangesSynced(changeIds);

      setSyncStatus(
        messages.syncUpComplete.replace(
          "{count}",
          pendingChanges.length.toString()
        )
      );
    } catch (error) {
      console.error("Error syncing up:", error);
      setErrorMessage(messages.syncUpError + ": " + (error as Error).message);
      setSyncStatus("");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="sync-view">
      <div className="sync-header">
        <h2>{messages.title}</h2>
        <p>{messages.description}</p>
      </div>

      <div className="sync-actions">
        <div className="sync-section">
          <h3>{messages.syncDownTitle}</h3>
          <p>{messages.syncDownDescription}</p>
          <button
            className="sync-button sync-down"
            onClick={handleSyncDown}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingDown
              ? messages.syncing
              : messages.syncDownButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.syncUpTitle}</h3>
          <p>{messages.syncUpDescription}</p>
          <button
            className="sync-button sync-up"
            onClick={handleSyncUp}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingUp
              ? messages.syncing
              : messages.syncUpButton}
          </button>
        </div>
      </div>

      {syncStatus && <div className="sync-status success">{syncStatus}</div>}

      {errorMessage && <div className="sync-status error">{errorMessage}</div>}
    </div>
  );
}
