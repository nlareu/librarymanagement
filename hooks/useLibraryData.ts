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
import * as api from "../data/api";

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
    const updatedAssets = api.addAsset(assetData);
    setAssets(updatedAssets);
    setIsAddAssetModalOpen(false);
  }, []);

  const handleAddUser = useCallback(async (userData: UserFormData) => {
    try {
      const updatedUsers = await api.addUser(userData);
      setUsers(updatedUsers);
      setIsAddUserModalOpen(false);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  }, []);

  const handleUpdateAsset = useCallback(
    (updatedData: AssetFormData) => {
      if (!editingAsset) return;
      const updatedAssets = api.updateAsset(editingAsset.id, updatedData);
      setAssets(updatedAssets);
      setEditingAsset(null);
    },
    [editingAsset]
  );

  const handleDeleteAsset = useCallback(() => {
    if (!deletingAsset) return;
    const { updatedAssets, updatedActiveLoans, updatedHistory } =
      api.deleteAsset(deletingAsset.id);
    setAssets(updatedAssets);
    setActiveLoans(updatedActiveLoans);
    setCompletedLoanHistory(updatedHistory);
    setDeletingAsset(null);
  }, [deletingAsset]);

  const handleBorrowAsset = useCallback((asset: Asset) => {
    setBorrowingAsset(asset);
  }, []);

  const handleReturnLoan = useCallback((loan: ActiveLoan) => {
    setReturningLoan(loan);
  }, []);

  const handleConfirmBorrow = useCallback(
    (borrowerId: string) => {
      if (!borrowingAsset) return;
      try {
        const updatedLoans = api.borrowAsset(borrowingAsset.id, borrowerId);
        setActiveLoans(updatedLoans);
        setBorrowingAsset(null);
      } catch (err) {
        console.error("Failed to borrow asset:", err);
      }
    },
    [borrowingAsset]
  );

  const handleConfirmReturn = useCallback(
    (returnDate: string) => {
      if (!returningLoan) return;
      try {
        const { updatedActiveLoans, updatedHistory } = api.returnLoan(
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
