/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import type { View } from "./types";
import { NavBar } from "./components/shared/NavBar/NavBar";
import { CollectionView } from "./components/pages/collection/CollectionView";
import { Modal } from "./components/shared/Modal/Modal";
import { AssetForm } from "./components/shared/AssetForm/AssetForm";
import { DeleteConfirmationModal } from "./components/shared/DeleteConfirmationModal/DeleteConfirmationModal";
import { BorrowModal } from "./components/shared/BorrowModal/BorrowModal";
import { ReturnModal } from "./components/shared/ReturnModal/ReturnModal";
import { UserListView } from "./components/pages/users/UserListView";
import { UserForm } from "./components/shared/UserForm/UserForm";
import { HistoryView } from "./components/pages/history/HistoryView";
import { UserDetailsModal } from "./components/shared/UserDetailsModal/UserDetailsModal";
import { stripMarcPrefix } from "./utils";
import { useLibraryData } from "./hooks/useLibraryData";
import { useCollectionFilters } from "./components/pages/collection/useCollectionFilters";
import { useHistoryFilters } from "./components/pages/history/useHistoryFilters";

import "./App.css";
import { messages } from "./messages";

export function App() {
  const [view, setView] = useState<View>("collection");

  const {
    assets,
    users,
    activeLoans,
    completedLoanHistory,
    isLoading,
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
    handleAddAsset,
    handleAddUser,
    handleUpdateAsset,
    handleDeleteAsset,
    handleBorrowAsset,
    handleReturnLoan,
    handleConfirmBorrow,
    handleConfirmReturn,
    handleSelectUser,
  } = useLibraryData();

  const { filteredAssets, availableAssetTypes, ...collectionFilterProps } =
    useCollectionFilters(assets);

  const { filteredLoanHistory, ...historyFilterProps } =
    useHistoryFilters(completedLoanHistory);

  if (isLoading) {
    return (
      <div className="app-container">
        <header>
          <h1>{messages.appTitle}</h1>
        </header>
        <div className="loading-state">Cargando biblioteca...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>{messages.appTitle}</h1>
      </header>
      <NavBar currentView={view} onNavigate={setView} />
      <main className="main-content">
        {view === "collection" && (
          <CollectionView
            assets={assets}
            filteredAssets={filteredAssets}
            activeLoans={activeLoans}
            onBorrow={handleBorrowAsset}
            onEdit={setEditingAsset}
            onDelete={setDeletingAsset}
            availableAssetTypes={availableAssetTypes}
            onAddAssetClick={() => setIsAddAssetModalOpen(true)}
            {...collectionFilterProps}
          />
        )}
        {view === "users" && (
          <UserListView
            users={users}
            onSelectUser={handleSelectUser}
            onAddUserClick={() => setIsAddUserModalOpen(true)}
          />
        )}
        {view === "history" && (
          <HistoryView
            activeLoans={activeLoans}
            completedLoans={filteredLoanHistory}
            onReturn={handleReturnLoan}
            {...historyFilterProps}
          />
        )}
      </main>

      {isAddAssetModalOpen && (
        <Modal
          isOpen={isAddAssetModalOpen}
          onClose={() => setIsAddAssetModalOpen(false)}
          title={messages.addAssetModalTitle}
        >
          <AssetForm
            onSubmit={handleAddAsset}
            submitButtonText={messages.addAssetSubmitButton}
            onCancel={() => setIsAddAssetModalOpen(false)}
            initialData={{
              title: "245-",
              type: "Libro",
              description: "520-",
              registrationNumber: "",
              signature: "",
              isbn: "020-",
              author: "100-",
              publisher: "260-",
              publicationPlace: "260-",
              edition: "250-",
              publicationYear: "260-",
              collectionTitle: "490-",
              collectionNumber: "490-",
              volumes: "1",
              copies: "1",
              isLoanable: true,
              subjects: [],
              ibicSubjects: [],
            }}
          />
        </Modal>
      )}

      {isAddUserModalOpen && (
        <Modal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          title={messages.addUserModalTitle}
        >
          <UserForm
            onSubmit={handleAddUser}
            submitButtonText={messages.addUserSubmitButton}
            onCancel={() => setIsAddUserModalOpen(false)}
          />
        </Modal>
      )}

      {editingAsset && (
        <Modal
          isOpen={!!editingAsset}
          onClose={() => setEditingAsset(null)}
          title={`${messages.editModalTitle}${
            stripMarcPrefix(editingAsset.title, "title") ?? ""
          }`}
        >
          <AssetForm
            onSubmit={handleUpdateAsset}
            initialData={{
              title: editingAsset.title,
              type: editingAsset.type,
              description: editingAsset.description,
              registrationNumber: editingAsset.registrationNumber ?? "",
              signature: editingAsset.signature ?? "",
              isbn: editingAsset.isbn ?? "",
              author: editingAsset.author ?? "",
              publisher: editingAsset.publisher ?? "",
              publicationPlace: editingAsset.publicationPlace ?? "",
              edition: editingAsset.edition ?? "",
              publicationYear: editingAsset.publicationYear ?? "",
              collectionTitle: editingAsset.collectionTitle ?? "",
              collectionNumber: editingAsset.collectionNumber ?? "",
              volumes: String(editingAsset.volumes ?? "1"),
              copies: String(editingAsset.copies ?? "1"),
              isLoanable: editingAsset.isLoanable ?? true,
              subjects: editingAsset.subjects ?? [],
              ibicSubjects: editingAsset.ibicSubjects ?? [],
            }}
            submitButtonText={messages.saveChanges}
            onCancel={() => setEditingAsset(null)}
          />
        </Modal>
      )}

      {deletingAsset && (
        <DeleteConfirmationModal
          asset={deletingAsset}
          isOpen={!!deletingAsset}
          onClose={() => setDeletingAsset(null)}
          onConfirm={handleDeleteAsset}
        />
      )}

      {borrowingAsset && (
        <BorrowModal
          asset={borrowingAsset}
          users={users}
          isOpen={!!borrowingAsset}
          onClose={() => setBorrowingAsset(null)}
          onConfirm={handleConfirmBorrow}
        />
      )}

      {returningLoan && (
        <ReturnModal
          loan={returningLoan}
          isOpen={!!returningLoan}
          onClose={() => setReturningLoan(null)}
          onConfirm={handleConfirmReturn}
        />
      )}

      {selectedUserDetail && (
        <UserDetailsModal
          user={selectedUserDetail}
          activeLoans={activeLoans}
          completedLoanHistory={completedLoanHistory}
          isOpen={!!selectedUserDetail}
          onClose={() => setSelectedUserDetail(null)}
        />
      )}
    </div>
  );
}
