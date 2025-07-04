/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as db from "./db";
import type {
  Asset,
  User,
  ActiveLoan,
  LoanHistoryRecord,
} from "../entities/index";
import type { AssetFormData } from "../components/shared/AssetForm/types";
import type { UserFormData } from "../components/shared/UserForm/types";
import { stripMarcPrefix } from "../utils";

// --- Data Loading ---

export async function loadInitialData() {
  // Ensure config is loaded before returning data
  await db.getConfig();
  const data = await db.initDb();
  return { ...data };
}

// --- Asset Operations ---

export function addAsset(assetData: AssetFormData): Asset[] {
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
  const currentAssets = db.getAssets();
  const updatedAssets = [...currentAssets, newAsset];
  db.saveAssets(updatedAssets);
  return updatedAssets;
}

export function updateAsset(
  assetId: string,
  updatedData: AssetFormData
): Asset[] {
  const updatedAsset = {
    title: updatedData.title,
    description: updatedData.description,
    isbn: updatedData.isbn,
    author: updatedData.author,
    publisher: updatedData.publisher,
    publicationPlace: updatedData.publicationPlace,
    edition: updatedData.edition,
    publicationYear: updatedData.publicationYear,
    collectionTitle: updatedData.collectionTitle,
    collectionNumber: updatedData.collectionNumber,
    subjects: updatedData.subjects,
    ibicSubjects: updatedData.ibicSubjects,
    type: updatedData.type,
    registrationNumber: updatedData.registrationNumber,
    signature: updatedData.signature,
    volumes: parseInt(updatedData.volumes) || 1,
    copies: parseInt(updatedData.copies) || 1,
    isLoanable: updatedData.isLoanable,
  };

  const currentAssets = db.getAssets();
  const updatedAssets = currentAssets.map((a) =>
    a.id === assetId ? { ...a, ...updatedAsset } : a
  );
  db.saveAssets(updatedAssets);
  return updatedAssets;
}

export function deleteAsset(assetId: string) {
  const currentAssets = db.getAssets();
  const updatedAssets = currentAssets.filter((a) => a.id !== assetId);
  db.saveAssets(updatedAssets);

  const currentActiveLoans = db.getActiveLoans();
  const updatedActiveLoans = currentActiveLoans.filter(
    (l) => l.assetId !== assetId
  );
  db.saveActiveLoans(updatedActiveLoans);

  const currentHistory = db.getCompletedLoanHistory();
  const updatedHistory = currentHistory.filter((h) => h.assetId !== assetId);
  db.saveCompletedLoanHistory(updatedHistory);

  return { updatedAssets, updatedActiveLoans, updatedHistory };
}

// --- User Operations ---

export async function addUser(userData: UserFormData): Promise<User[]> {
  const config = await db.getConfig();
  const prefix = config?.userCodePrefix;
  if (!prefix) {
    console.error("User code prefix is not loaded. Cannot create user.");
    throw new Error("User code prefix not configured.");
  }

  const users = db.getUsers();
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

  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    userCode,
  };

  const updatedUsers = [...users, newUser];
  db.saveUsers(updatedUsers);
  return updatedUsers;
}

// --- Loan Operations ---

export function borrowAsset(assetId: string, userId: string): ActiveLoan[] {
  const users = db.getUsers();
  const assets = db.getAssets();

  const borrower = users.find((u) => u.id === userId);
  const asset = assets.find((a) => a.id === assetId);

  if (!borrower || !asset) {
    console.error("Borrower or asset not found");
    throw new Error("Borrower or asset not found.");
  }

  const newLoan: ActiveLoan = {
    id: crypto.randomUUID(),
    assetId: asset.id,
    assetTitle: stripMarcPrefix(asset.title, "title") ?? "Untitled",
    userId: borrower.id,
    userName: `${borrower.lastName}, ${borrower.name}`,
    borrowDate: new Date().toISOString(),
  };

  const currentLoans = db.getActiveLoans();
  const updatedLoans = [...currentLoans, newLoan];
  db.saveActiveLoans(updatedLoans);
  return updatedLoans;
}

export function returnLoan(loanId: string, returnDate: string) {
  const activeLoans = db.getActiveLoans();
  const loanToReturn = activeLoans.find((l) => l.id === loanId);

  if (!loanToReturn) {
    console.error("Loan to return not found");
    throw new Error("Loan not found.");
  }

  const newHistoryRecord: LoanHistoryRecord = {
    ...loanToReturn,
    returnDate: returnDate,
  };

  const history = db.getCompletedLoanHistory();
  const updatedHistory = [...history, newHistoryRecord];
  db.saveCompletedLoanHistory(updatedHistory);

  const updatedActiveLoans = activeLoans.filter((l) => l.id !== loanId);
  db.saveActiveLoans(updatedActiveLoans);

  return { updatedActiveLoans, updatedHistory };
}
