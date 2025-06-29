/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useCallback } from "react";
import type {
  Asset,
  User,
  ActiveLoan,
  LoanHistoryRecord,
} from "../entities/index";
import type { AssetFormData } from "../components/shared/AssetForm/types";
import type { UserFormData } from "../components/shared/UserForm/types";
import * as api from "../data/tauri-api";

export function useLibraryData() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([]);
  const [completedLoanHistory, setCompletedLoanHistory] = useState<
    LoanHistoryRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  const [borrowingAsset, setBorrowingAsset] = useState<Asset | null>(null);
  const [returningLoan, setReturningLoan] = useState<ActiveLoan | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(
    null
  );
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Unified data loading effect
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        const { assets, users, activeLoans, completedLoanHistory } =
          await api.loadInitialData();
        setAssets(assets);
        setUsers(users);
        setActiveLoans(activeLoans);
        setCompletedLoanHistory(completedLoanHistory);
      } catch (err) {
        console.error("Failed to initialize app data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleAddAsset = useCallback(async (assetData: AssetFormData) => {
    console.log("handleAddAsset called with:", assetData);
    try {
      console.log("Calling api.addAsset...");
      const updatedAssets = await api.addAsset(assetData);
      console.log("api.addAsset returned:", updatedAssets);
      setAssets(updatedAssets);
      setIsAddAssetModalOpen(false);
      console.log("Asset added successfully, modal closed");
    } catch (err) {
      console.error("Failed to add asset:", err);
      // Don't close modal on error
    }
  }, []);

  const handleAddUser = useCallback(async (userData: UserFormData) => {
    console.log("handleAddUser called with:", userData);
    try {
      console.log("Calling api.addUser...");
      const updatedUsers = await api.addUser(userData);
      console.log("api.addUser returned:", updatedUsers);
      setUsers(updatedUsers);
      setIsAddUserModalOpen(false);
      console.log("User added successfully, modal closed");
    } catch (err) {
      console.error("Failed to add user:", err);
      // Don't close modal on error
    }
  }, []);

  const handleUpdateAsset = useCallback(
    async (updatedData: AssetFormData) => {
      if (!editingAsset) return;
      try {
        const updatedAssets = await api.updateAsset(
          editingAsset.id,
          updatedData
        );
        setAssets(updatedAssets);
        setEditingAsset(null);
      } catch (err) {
        console.error("Failed to update asset:", err);
      }
    },
    [editingAsset]
  );

  const handleDeleteAsset = useCallback(async () => {
    if (!deletingAsset) return;
    try {
      const { updatedAssets, updatedActiveLoans, updatedHistory } =
        await api.deleteAsset(deletingAsset.id);
      setAssets(updatedAssets);
      setActiveLoans(updatedActiveLoans);
      setCompletedLoanHistory(updatedHistory);
      setDeletingAsset(null);
    } catch (err) {
      console.error("Failed to delete asset:", err);
    }
  }, [deletingAsset]);

  const handleBorrowAsset = useCallback((asset: Asset) => {
    setBorrowingAsset(asset);
  }, []);

  const handleReturnLoan = useCallback((loan: ActiveLoan) => {
    setReturningLoan(loan);
  }, []);

  const handleConfirmBorrow = useCallback(
    async (borrowerId: string) => {
      if (!borrowingAsset) return;
      try {
        const updatedLoans = await api.borrowAsset(
          borrowingAsset.id,
          borrowerId
        );
        setActiveLoans(updatedLoans);
        setBorrowingAsset(null);
      } catch (err) {
        console.error("Failed to borrow asset:", err);
      }
    },
    [borrowingAsset]
  );

  const handleConfirmReturn = useCallback(
    async (returnDate: string) => {
      if (!returningLoan) return;
      try {
        const { updatedActiveLoans, updatedHistory } = await api.returnLoan(
          returningLoan.id,
          returnDate
        );
        setActiveLoans(updatedActiveLoans);
        setCompletedLoanHistory(updatedHistory);
        setReturningLoan(null);
      } catch (err) {
        console.error("Failed to return loan:", err);
      }
    },
    [returningLoan]
  );

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUserDetail(user);
  }, []);

  return {
    // Data
    assets,
    users,
    activeLoans,
    completedLoanHistory,
    isLoading,

    // Modal state and setters
    editingAsset,
    setEditingAsset,
    deletingAsset,
    setDeletingAsset,
    borrowingAsset,
    setBorrowingAsset,
    returningLoan,
    setReturningLoan,
    selectedUserDetail,
    setSelectedUserDetail,
    isAddAssetModalOpen,
    setIsAddAssetModalOpen,
    isAddUserModalOpen,
    setIsAddUserModalOpen,

    // Data mutation handlers
    handleAddAsset,
    handleAddUser,
    handleUpdateAsset,
    handleDeleteAsset,
    handleBorrowAsset,
    handleReturnLoan,
    handleConfirmBorrow,
    handleConfirmReturn,
    handleSelectUser,
  };
}
