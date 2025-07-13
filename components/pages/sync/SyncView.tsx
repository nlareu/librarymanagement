/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import {
  fetchUserDataSpreadsheet,
  syncUserChangesToUserDataSpreadsheet,
  fetchAssetsDataSpreadsheet,
  syncAssetChangesToAssetsDataSpreadsheet,
  fetchLoansDataSpreadsheet,
  syncLoanChangesToLoansDataSpreadsheet,
} from "../../../data/spreadsheet";
import {
  saveUsers,
  saveAssets,
  saveActiveLoans,
  saveCompletedLoanHistory,
} from "../../../data/db";
import {
  getPendingUserChanges,
  markUserChangesSynced,
  getPendingAssetChanges,
  markAssetChangesSynced,
  getPendingLoanChanges,
  markLoanChangesSynced,
  clearUserChanges,
  clearAssetChanges,
  clearLoanChanges,
} from "../../../data/api";
import type { User } from "../../../entities/User";
import type { Asset } from "../../../entities/Asset";
import type { ActiveLoan, LoanHistoryRecord } from "../../../entities/Loan";
import "./SyncView.css";
import { messages } from "./messages";

export function SyncView() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUserSyncDown = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingUserDown);
    setErrorMessage("");

    try {
      const spreadsheetData = await fetchUserDataSpreadsheet();

      if (spreadsheetData.rows.length === 0) {
        setSyncStatus(messages.noUserDataFound);
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

      // Clear user change history since we're now in sync
      clearUserChanges();

      setSyncStatus(
        messages.syncUserDownComplete.replace(
          "{count}",
          users.length.toString()
        )
      );
    } catch (error) {
      console.error("Error syncing users down:", error);
      setErrorMessage(
        messages.syncUserDownError + ": " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUserSyncUp = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingUserUp);
    setErrorMessage("");

    try {
      const pendingChanges = getPendingUserChanges();

      if (pendingChanges.length === 0) {
        setSyncStatus(messages.noPendingUserChanges);
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
        messages.syncUserUpComplete.replace(
          "{count}",
          pendingChanges.length.toString()
        )
      );
    } catch (error) {
      console.error("Error syncing users up:", error);
      setErrorMessage(
        messages.syncUserUpError + ": " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      // Clear user change history after sync attempt (successful or not)
      clearUserChanges();
      setIsSyncing(false);
    }
  };

  const handleAssetSyncDown = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingAssetDown);
    setErrorMessage("");

    try {
      const spreadsheetData = await fetchAssetsDataSpreadsheet();

      if (spreadsheetData.rows.length === 0) {
        setSyncStatus(messages.noAssetDataFound);
        return;
      }

      // Convert spreadsheet data to Asset objects
      const assets: Asset[] = spreadsheetData.rows.map((row) => ({
        id: row.id || crypto.randomUUID(),
        title: row.title || "",
        description: row.description || "",
        isbn: row.isbn || "",
        author: row.author || "",
        publisher: row.publisher || "",
        publicationPlace: row.publicationPlace || "",
        edition: row.edition || "",
        publicationYear: row.publicationYear || "",
        collectionTitle: row.collectionTitle || "",
        collectionNumber: row.collectionNumber || "",
        subjects: row.subjects
          ? row.subjects.split(",").map((s) => s.trim())
          : [],
        ibicSubjects: row.ibicSubjects
          ? row.ibicSubjects.split(",").map((s) => s.trim())
          : [],
        type: (row.type as Asset["type"]) || "Libro",
        registrationNumber: row.registrationNumber || "",
        signature: row.signature || "",
        volumes: parseInt(row.volumes) || 1,
        copies: parseInt(row.copies) || 1,
        isLoanable: row.isLoanable === "true" || row.isLoanable === "TRUE",
      }));

      // Save to local storage
      saveAssets(assets);

      // Clear asset change history since we're now in sync
      clearAssetChanges();

      setSyncStatus(
        messages.syncAssetDownComplete.replace(
          "{count}",
          assets.length.toString()
        )
      );
    } catch (error) {
      console.error("Error syncing assets down:", error);
      setErrorMessage(
        messages.syncAssetDownError + ": " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAssetSyncUp = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingAssetUp);
    setErrorMessage("");

    try {
      const pendingChanges = getPendingAssetChanges();

      if (pendingChanges.length === 0) {
        setSyncStatus(messages.noPendingAssetChanges);
        return;
      }

      // Convert changes to spreadsheet format
      const changesToSync = pendingChanges.map((change) => ({
        changeType: change.changeType,
        assetId: change.assetId,
        assetData: change.newData
          ? {
              id: change.assetId,
              title: change.newData.title || "",
              description: change.newData.description || "",
              isbn: change.newData.isbn || "",
              author: change.newData.author || "",
              publisher: change.newData.publisher || "",
              publicationPlace: change.newData.publicationPlace || "",
              edition: change.newData.edition || "",
              publicationYear: change.newData.publicationYear || "",
              collectionTitle: change.newData.collectionTitle || "",
              collectionNumber: change.newData.collectionNumber || "",
              subjects: Array.isArray(change.newData.subjects)
                ? change.newData.subjects.join(", ")
                : change.newData.subjects || "",
              ibicSubjects: Array.isArray(change.newData.ibicSubjects)
                ? change.newData.ibicSubjects.join(", ")
                : change.newData.ibicSubjects || "",
              type: change.newData.type || "",
              registrationNumber: change.newData.registrationNumber || "",
              signature: change.newData.signature || "",
              volumes: change.newData.volumes || "",
              copies: change.newData.copies || "",
              isLoanable: change.newData.isLoanable ? "true" : "false",
            }
          : undefined,
      }));

      await syncAssetChangesToAssetsDataSpreadsheet(changesToSync);

      // Mark changes as synced
      const changeIds = pendingChanges.map((change) => change.id);
      markAssetChangesSynced(changeIds);

      setSyncStatus(
        messages.syncAssetUpComplete.replace(
          "{count}",
          pendingChanges.length.toString()
        )
      );
    } catch (error) {
      console.error("Error syncing assets up:", error);
      setErrorMessage(
        messages.syncAssetUpError + ": " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      // Clear asset change history after sync attempt (successful or not)
      clearAssetChanges();
      setIsSyncing(false);
    }
  };

  const handleLoanSyncDown = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingLoanDown);
    setErrorMessage("");

    try {
      const spreadsheetData = await fetchLoansDataSpreadsheet();

      if (spreadsheetData.rows.length === 0) {
        setSyncStatus(messages.noLoanDataFound);
        return;
      }

      // Convert spreadsheet data to loan objects
      // Note: We need to separate active loans from completed loans
      const allLoans = spreadsheetData.rows.map((row) => ({
        id: row.id || crypto.randomUUID(),
        assetId: row.assetId || "",
        assetTitle: row.assetTitle || "",
        userId: row.userId || "",
        userName: row.userName || "",
        borrowDate: row.borrowDate || "",
        returnDate: row.returnDate || undefined,
      }));

      // Separate active loans from completed loans
      const activeLoans: ActiveLoan[] = allLoans
        .filter((loan) => !loan.returnDate)
        .map((loan) => ({
          id: loan.id,
          assetId: loan.assetId,
          assetTitle: loan.assetTitle,
          userId: loan.userId,
          userName: loan.userName,
          borrowDate: loan.borrowDate,
        }));

      const completedLoans: LoanHistoryRecord[] = allLoans
        .filter((loan) => loan.returnDate)
        .map((loan) => ({
          id: loan.id,
          assetId: loan.assetId,
          assetTitle: loan.assetTitle,
          userId: loan.userId,
          userName: loan.userName,
          borrowDate: loan.borrowDate,
          returnDate: loan.returnDate!,
        }));

      // Save to local storage
      saveActiveLoans(activeLoans);
      saveCompletedLoanHistory(completedLoans);

      // Clear loan change history since we're now in sync
      clearLoanChanges();

      setSyncStatus(
        messages.syncLoanDownComplete.replace(
          "{count}",
          allLoans.length.toString()
        )
      );
    } catch (error) {
      console.error("Error syncing loans down:", error);
      setErrorMessage(
        messages.syncLoanDownError + ": " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoanSyncUp = async () => {
    setIsSyncing(true);
    setSyncStatus(messages.syncingLoanUp);
    setErrorMessage("");

    try {
      const pendingChanges = getPendingLoanChanges();

      if (pendingChanges.length === 0) {
        setSyncStatus(messages.noPendingLoanChanges);
        return;
      }

      // Convert changes to spreadsheet format
      const changesToSync = pendingChanges.map((change) => ({
        changeType: change.changeType,
        loanId: change.loanId,
        loanData: change.newData
          ? {
              id: change.loanId,
              assetId: change.newData.assetId || "",
              assetTitle: change.newData.assetTitle || "",
              userId: change.newData.userId || "",
              userName: change.newData.userName || "",
              borrowDate: change.newData.borrowDate || "",
            }
          : undefined,
      }));

      await syncLoanChangesToLoansDataSpreadsheet(changesToSync);

      // Mark changes as synced
      const changeIds = pendingChanges.map((change) => change.id);
      markLoanChangesSynced(changeIds);

      setSyncStatus(
        messages.syncLoanUpComplete.replace(
          "{count}",
          pendingChanges.length.toString()
        )
      );
    } catch (error) {
      console.error("Error syncing loans up:", error);
      setErrorMessage(
        messages.syncLoanUpError + ": " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      // Clear loan change history after sync attempt (successful or not)
      clearLoanChanges();
      setIsSyncing(false);
    }
  };

  const handleClearUserChanges = async () => {
    setIsSyncing(true);
    setSyncStatus("Limpiando historial de cambios de usuarios...");
    setErrorMessage("");

    try {
      clearUserChanges();
      setSyncStatus(messages.clearUserChangesComplete);
    } catch (error) {
      console.error("Error clearing user changes:", error);
      setErrorMessage(
        "❌ Error al limpiar cambios de usuarios: " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearAssetChanges = async () => {
    setIsSyncing(true);
    setSyncStatus("Limpiando historial de cambios de activos...");
    setErrorMessage("");

    try {
      clearAssetChanges();
      setSyncStatus(messages.clearAssetChangesComplete);
    } catch (error) {
      console.error("Error clearing asset changes:", error);
      setErrorMessage(
        "❌ Error al limpiar cambios de activos: " + (error as Error).message
      );
      setSyncStatus("");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearLoanChanges = async () => {
    setIsSyncing(true);
    setSyncStatus("Limpiando historial de cambios de préstamos...");
    setErrorMessage("");

    try {
      clearLoanChanges();
      setSyncStatus(messages.clearLoanChangesComplete);
    } catch (error) {
      console.error("Error clearing loan changes:", error);
      setErrorMessage(
        "❌ Error al limpiar cambios de préstamos: " + (error as Error).message
      );
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
          <h3>{messages.userSyncDownTitle}</h3>
          <p>{messages.userSyncDownDescription}</p>
          <button
            className="sync-button sync-down"
            onClick={handleUserSyncDown}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingUserDown
              ? messages.syncing
              : messages.userSyncDownButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.userSyncUpTitle}</h3>
          <p>{messages.userSyncUpDescription}</p>
          <button
            className="sync-button sync-up"
            onClick={handleUserSyncUp}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingUserUp
              ? messages.syncing
              : messages.userSyncUpButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.assetSyncDownTitle}</h3>
          <p>{messages.assetSyncDownDescription}</p>
          <button
            className="sync-button sync-down"
            onClick={handleAssetSyncDown}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingAssetDown
              ? messages.syncing
              : messages.assetSyncDownButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.assetSyncUpTitle}</h3>
          <p>{messages.assetSyncUpDescription}</p>
          <button
            className="sync-button sync-up"
            onClick={handleAssetSyncUp}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingAssetUp
              ? messages.syncing
              : messages.assetSyncUpButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.loanSyncDownTitle}</h3>
          <p>{messages.loanSyncDownDescription}</p>
          <button
            className="sync-button sync-down"
            onClick={handleLoanSyncDown}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingLoanDown
              ? messages.syncing
              : messages.loanSyncDownButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.loanSyncUpTitle}</h3>
          <p>{messages.loanSyncUpDescription}</p>
          <button
            className="sync-button sync-up"
            onClick={handleLoanSyncUp}
            disabled={isSyncing}
          >
            {isSyncing && syncStatus === messages.syncingLoanUp
              ? messages.syncing
              : messages.loanSyncUpButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.clearUserChangesTitle}</h3>
          <p>{messages.clearUserChangesDescription}</p>
          <button
            className="sync-button clear-changes"
            onClick={handleClearUserChanges}
            disabled={isSyncing}
          >
            {messages.clearUserChangesButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.clearAssetChangesTitle}</h3>
          <p>{messages.clearAssetChangesDescription}</p>
          <button
            className="sync-button clear-changes"
            onClick={handleClearAssetChanges}
            disabled={isSyncing}
          >
            {messages.clearAssetChangesButton}
          </button>
        </div>

        <div className="sync-section">
          <h3>{messages.clearLoanChangesTitle}</h3>
          <p>{messages.clearLoanChangesDescription}</p>
          <button
            className="sync-button clear-changes"
            onClick={handleClearLoanChanges}
            disabled={isSyncing}
          >
            {messages.clearLoanChangesButton}
          </button>
        </div>
      </div>

      {syncStatus && <div className="sync-status success">{syncStatus}</div>}

      {errorMessage && <div className="sync-status error">{errorMessage}</div>}
    </div>
  );
}
