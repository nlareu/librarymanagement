/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as db from "./tauri-db";
import type {
  Asset,
  User,
  ActiveLoan,
  LoanHistoryRecord,
} from "../entities/index";
import type { AssetFormData } from "../components/shared/AssetForm/types";
import type { UserFormData } from "../components/shared/UserForm/types";

// --- Data Loading ---

export async function loadInitialData() {
  // Ensure config is loaded before returning data
  await db.getConfig();
  const data = await db.initDb();
  return { ...data };
}

// --- Asset Operations ---

export async function addAsset(assetData: AssetFormData): Promise<Asset[]> {
  console.log("api.addAsset called with:", assetData);

  const newAsset: Asset = {
    id: crypto.randomUUID(),
    title: assetData.title,
    description: assetData.description,
    isbn: assetData.isbn,
    author: assetData.author,
    publisher: assetData.publisher,
    publicationPlace: assetData.publicationPlace,
    edition: assetData.edition,
    publicationYear: assetData.publicationYear,
    collectionTitle: assetData.collectionTitle,
    collectionNumber: assetData.collectionNumber,
    subjects: assetData.subjects,
    ibicSubjects: assetData.ibicSubjects,
    type: assetData.type,
    registrationNumber: assetData.registrationNumber,
    signature: assetData.signature,
    volumes: parseInt(assetData.volumes) || 1,
    copies: parseInt(assetData.copies) || 1,
    isLoanable: assetData.isLoanable,
  };
  console.log("New asset object:", newAsset);

  const currentAssets = await db.getAssets();
  console.log("Current assets:", currentAssets);

  const updatedAssets = [...currentAssets, newAsset];
  console.log("About to save assets:", updatedAssets);

  await db.saveAssets(updatedAssets);
  console.log("Assets saved successfully");

  return updatedAssets;
}

export async function updateAsset(
  assetId: string,
  assetData: AssetFormData
): Promise<Asset[]> {
  const currentAssets = await db.getAssets();
  const updatedAssets = currentAssets.map((asset) =>
    asset.id === assetId
      ? {
          ...asset,
          title: assetData.title,
          description: assetData.description,
          isbn: assetData.isbn,
          author: assetData.author,
          publisher: assetData.publisher,
          publicationPlace: assetData.publicationPlace,
          edition: assetData.edition,
          publicationYear: assetData.publicationYear,
          collectionTitle: assetData.collectionTitle,
          collectionNumber: assetData.collectionNumber,
          subjects: assetData.subjects,
          ibicSubjects: assetData.ibicSubjects,
          type: assetData.type,
          registrationNumber: assetData.registrationNumber,
          signature: assetData.signature,
          volumes: parseInt(assetData.volumes) || 1,
          copies: parseInt(assetData.copies) || 1,
          isLoanable: assetData.isLoanable,
        }
      : asset
  );
  await db.saveAssets(updatedAssets);
  return updatedAssets;
}

export async function deleteAsset(assetId: string): Promise<{
  updatedAssets: Asset[];
  updatedActiveLoans: ActiveLoan[];
  updatedHistory: LoanHistoryRecord[];
}> {
  const [currentAssets, currentActiveLoans, currentHistory] = await Promise.all(
    [db.getAssets(), db.getActiveLoans(), db.getCompletedLoanHistory()]
  );

  // Remove the asset
  const updatedAssets = currentAssets.filter((asset) => asset.id !== assetId);

  // Remove any active loans for this asset
  const updatedActiveLoans = currentActiveLoans.filter(
    (loan) => loan.assetId !== assetId
  );

  // Remove any history records for this asset
  const updatedHistory = currentHistory.filter(
    (record) => record.assetId !== assetId
  );

  await Promise.all([
    db.saveAssets(updatedAssets),
    db.saveActiveLoans(updatedActiveLoans),
    db.saveCompletedLoanHistory(updatedHistory),
  ]);

  return { updatedAssets, updatedActiveLoans, updatedHistory };
}

// --- User Operations ---

export async function addUser(userData: UserFormData): Promise<User[]> {
  console.log("api.addUser called with:", userData);

  const config = await db.getConfig();
  console.log("Config loaded:", config);

  const prefix = config?.userCodePrefix;
  if (!prefix) {
    console.error("User code prefix is not loaded. Cannot create user.");
    throw new Error("User code prefix not configured.");
  }

  const users = await db.getUsers();
  console.log("Current users:", users);

  const highestNumber = users.reduce((max, user) => {
    if (user.userCode && user.userCode.startsWith(prefix + "-")) {
      const numberPart = user.userCode.slice(prefix.length + 1);
      const number = parseInt(numberPart, 10);
      if (!isNaN(number) && number > max) {
        return number;
      }
    }
    return max;
  }, 0);

  const nextNumber = highestNumber + 1;
  const userCode = `${prefix}-${String(nextNumber).padStart(4, "0")}`;
  console.log("Generated user code:", userCode);

  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    userCode,
  };
  console.log("New user object:", newUser);

  const updatedUsers = [...users, newUser];
  console.log("About to save users:", updatedUsers);

  await db.saveUsers(updatedUsers);
  console.log("Users saved successfully");

  return updatedUsers;
}

// --- Loan Operations ---

export async function borrowAsset(
  assetId: string,
  borrowerId: string
): Promise<ActiveLoan[]> {
  const [assets, users, currentLoans] = await Promise.all([
    db.getAssets(),
    db.getUsers(),
    db.getActiveLoans(),
  ]);

  const asset = assets.find((a) => a.id === assetId);
  const user = users.find((u) => u.id === borrowerId);

  if (!asset) {
    throw new Error("Asset not found");
  }

  if (!user) {
    throw new Error("User not found");
  }

  const newLoan: ActiveLoan = {
    id: crypto.randomUUID(),
    assetId: asset.id,
    assetTitle: asset.title,
    userId: user.id,
    userName: `${user.name} ${user.lastName}`,
    borrowDate: new Date().toISOString(),
  };

  const updatedLoans = [...currentLoans, newLoan];
  await db.saveActiveLoans(updatedLoans);
  return updatedLoans;
}

export async function returnLoan(
  loanId: string,
  returnDate: string
): Promise<{
  updatedActiveLoans: ActiveLoan[];
  updatedHistory: LoanHistoryRecord[];
}> {
  const [currentActiveLoans, currentHistory] = await Promise.all([
    db.getActiveLoans(),
    db.getCompletedLoanHistory(),
  ]);

  const loan = currentActiveLoans.find((l) => l.id === loanId);
  if (!loan) {
    throw new Error("Loan not found");
  }

  // Remove from active loans
  const updatedActiveLoans = currentActiveLoans.filter((l) => l.id !== loanId);

  // Add to history
  const historyRecord: LoanHistoryRecord = {
    id: loan.id,
    assetId: loan.assetId,
    assetTitle: loan.assetTitle,
    userId: loan.userId,
    userName: loan.userName,
    borrowDate: loan.borrowDate,
    returnDate,
  };

  const updatedHistory = [...currentHistory, historyRecord];

  await Promise.all([
    db.saveActiveLoans(updatedActiveLoans),
    db.saveCompletedLoanHistory(updatedHistory),
  ]);

  return { updatedActiveLoans, updatedHistory };
}
