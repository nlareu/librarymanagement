/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type {
  Asset,
  User,
  ActiveLoan,
  LoanHistoryRecord,
  UserChange,
  AssetChange,
  LoanChange,
} from "../entities/index";

const ASSETS_KEY = "libraryAssets";
const USERS_KEY = "libraryUsers";
const ACTIVE_LOANS_KEY = "libraryActiveLoans";
const COMPLETED_HISTORY_KEY = "libraryCompletedHistory";
const USER_CHANGES_KEY = "libraryUserChanges";
const ASSET_CHANGES_KEY = "libraryAssetChanges";
const LOAN_CHANGES_KEY = "libraryLoanChanges";

// --- Configuration ---
let config: { userCodePrefix: string } | null = null;
export async function getConfig() {
  if (!config) {
    try {
      const res = await fetch("./config.json");
      if (!res.ok) throw new Error(`Failed to load config: ${res.status}`);
      config = await res.json();
    } catch (err) {
      console.error(err);
      // Default config if fetch fails
      config = { userCodePrefix: "XX" };
    }
  }
  return config;
}

// --- LocalStorage Interaction ---

const getFromStorage = <T>(key: string): T | null => {
  const stored = localStorage.getItem(key);
  return stored ? (JSON.parse(stored) as T) : null;
};

const saveToStorage = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save to localStorage key "${key}":`, err);
  }
};

// --- Data Access Functions ---

export const getAssets = (): Asset[] =>
  getFromStorage<Asset[]>(ASSETS_KEY) ?? [];
export const saveAssets = (assets: Asset[]) =>
  saveToStorage(ASSETS_KEY, assets);

export const getUsers = (): User[] => getFromStorage<User[]>(USERS_KEY) ?? [];
export const saveUsers = (users: User[]) => saveToStorage(USERS_KEY, users);

export const getActiveLoans = (): ActiveLoan[] =>
  getFromStorage<ActiveLoan[]>(ACTIVE_LOANS_KEY) ?? [];
export const saveActiveLoans = (loans: ActiveLoan[]) =>
  saveToStorage(ACTIVE_LOANS_KEY, loans);

export const getCompletedLoanHistory = (): LoanHistoryRecord[] =>
  getFromStorage<LoanHistoryRecord[]>(COMPLETED_HISTORY_KEY) ?? [];
export const saveCompletedLoanHistory = (history: LoanHistoryRecord[]) =>
  saveToStorage(COMPLETED_HISTORY_KEY, history);

export const getUserChanges = (): UserChange[] =>
  getFromStorage<UserChange[]>(USER_CHANGES_KEY) ?? [];
export const saveUserChanges = (changes: UserChange[]) =>
  saveToStorage(USER_CHANGES_KEY, changes);

export const addUserChange = (change: UserChange) => {
  const existingChanges = getUserChanges();
  const updatedChanges = [...existingChanges, change];
  saveUserChanges(updatedChanges);
};

export const markUserChangesSynced = (changeIds: string[]) => {
  const existingChanges = getUserChanges();
  const updatedChanges = existingChanges.map((change) =>
    changeIds.includes(change.id) ? { ...change, synced: true } : change
  );
  saveUserChanges(updatedChanges);
};

export const getPendingUserChanges = (): UserChange[] => {
  return getUserChanges().filter((change) => !change.synced);
};

export const getAssetChanges = (): AssetChange[] =>
  getFromStorage<AssetChange[]>(ASSET_CHANGES_KEY) ?? [];
export const saveAssetChanges = (changes: AssetChange[]) =>
  saveToStorage(ASSET_CHANGES_KEY, changes);

export const addAssetChange = (change: AssetChange) => {
  const existingChanges = getAssetChanges();
  const updatedChanges = [...existingChanges, change];
  saveAssetChanges(updatedChanges);
};

export const markAssetChangesSynced = (changeIds: string[]) => {
  const existingChanges = getAssetChanges();
  const updatedChanges = existingChanges.map((change) =>
    changeIds.includes(change.id) ? { ...change, synced: true } : change
  );
  saveAssetChanges(updatedChanges);
};

export const getPendingAssetChanges = (): AssetChange[] => {
  return getAssetChanges().filter((change) => !change.synced);
};

// --- Loan Changes ---

export const getLoanChanges = (): LoanChange[] =>
  getFromStorage<LoanChange[]>(LOAN_CHANGES_KEY) ?? [];
export const saveLoanChanges = (changes: LoanChange[]) =>
  saveToStorage(LOAN_CHANGES_KEY, changes);

export const addLoanChange = (change: LoanChange) => {
  const existingChanges = getLoanChanges();
  const updatedChanges = [...existingChanges, change];
  saveLoanChanges(updatedChanges);
};

export const markLoanChangesSynced = (changeIds: string[]) => {
  const existingChanges = getLoanChanges();
  const updatedChanges = existingChanges.map((change) =>
    changeIds.includes(change.id) ? { ...change, synced: true } : change
  );
  saveLoanChanges(updatedChanges);
};

export const getPendingLoanChanges = (): LoanChange[] => {
  return getLoanChanges().filter((change) => !change.synced);
};

// --- Initialization ---

export async function initDb() {
  // Simply return current data from localStorage
  return {
    assets: getAssets(),
    users: getUsers(),
    activeLoans: getActiveLoans(),
    completedLoanHistory: getCompletedLoanHistory(),
  };
}
