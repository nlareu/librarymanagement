/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { invoke } from "@tauri-apps/api/core";
import { loadStarterData } from "../initial-data";
import type {
  Asset,
  User,
  ActiveLoan,
  LoanHistoryRecord,
} from "../entities/index";

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

// --- Tauri Database Interaction ---

export const getAssets = async (): Promise<Asset[]> => {
  try {
    return await invoke<Asset[]>("get_assets");
  } catch (err) {
    console.error("Failed to get assets:", err);
    return [];
  }
};

export const saveAssets = async (assets: Asset[]): Promise<void> => {
  console.log("db.saveAssets called with:", assets);
  try {
    console.log("Invoking save_assets Tauri command...");
    await invoke("save_assets", { assets });
    console.log("save_assets Tauri command completed successfully");
  } catch (err) {
    console.error("Failed to save assets:", err);
    throw err;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    return await invoke<User[]>("get_users");
  } catch (err) {
    console.error("Failed to get users:", err);
    return [];
  }
};

export const saveUsers = async (users: User[]): Promise<void> => {
  console.log("db.saveUsers called with:", users);
  try {
    console.log("Invoking save_users Tauri command...");
    await invoke("save_users", { users });
    console.log("save_users Tauri command completed successfully");
  } catch (err) {
    console.error("Failed to save users:", err);
    throw err;
  }
};

export const getActiveLoans = async (): Promise<ActiveLoan[]> => {
  try {
    return await invoke<ActiveLoan[]>("get_active_loans");
  } catch (err) {
    console.error("Failed to get active loans:", err);
    return [];
  }
};

export const saveActiveLoans = async (loans: ActiveLoan[]): Promise<void> => {
  try {
    await invoke("save_active_loans", { loans });
  } catch (err) {
    console.error("Failed to save active loans:", err);
    throw err;
  }
};

export const getCompletedLoanHistory = async (): Promise<
  LoanHistoryRecord[]
> => {
  try {
    return await invoke<LoanHistoryRecord[]>("get_loan_history");
  } catch (err) {
    console.error("Failed to get loan history:", err);
    return [];
  }
};

export const saveCompletedLoanHistory = async (
  history: LoanHistoryRecord[]
): Promise<void> => {
  try {
    await invoke("save_loan_history", { history });
  } catch (err) {
    console.error("Failed to save loan history:", err);
    throw err;
  }
};

// --- Initialization ---

export async function initDb() {
  try {
    console.log("Initializing database...");
    // Initialize the database first
    await invoke("init_database");
    console.log("Database initialization command completed");

    // Check if any data exists
    console.log("Getting stored assets...");
    const storedAssets = await getAssets();
    console.log("Retrieved assets:", storedAssets);

    if (storedAssets.length === 0) {
      console.log("No data found in database. Initializing with starter data.");
      try {
        const {
          initialAssets,
          initialUsers,
          initialActiveLoans,
          initialCompletedLoans,
        } = await loadStarterData();

        await saveAssets(initialAssets);
        await saveUsers(initialUsers);
        await saveActiveLoans(initialActiveLoans);
        await saveCompletedLoanHistory(initialCompletedLoans);

        return {
          assets: initialAssets,
          users: initialUsers,
          activeLoans: initialActiveLoans,
          completedLoanHistory: initialCompletedLoans,
        };
      } catch (err) {
        console.error("Failed to initialize starter data:", err);
        return {
          assets: [],
          users: [],
          activeLoans: [],
          completedLoanHistory: [],
        };
      }
    } else {
      return {
        assets: await getAssets(),
        users: await getUsers(),
        activeLoans: await getActiveLoans(),
        completedLoanHistory: await getCompletedLoanHistory(),
      };
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
    return {
      assets: [],
      users: [],
      activeLoans: [],
      completedLoanHistory: [],
    };
  }
}
