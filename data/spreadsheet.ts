/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Define the data structure for spreadsheet data
export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
}

// The base URL of the Google Apps Script web app.
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzVZVn-ocnyrmQBQAlAiet_pjERi5pGZLNJZKNbB_PETYNXDGrRaHIG0HstXb2pX5BH/exec";

// The ID of the specific spreadsheet for user, assets, and loans data, injected via environment variables.
const USER_DATA_SPREADSHEET_ID: string = process.env.USER_DATA_SPREADSHEET_ID!;
const ASSETS_DATA_SPREADSHEET_ID: string =
  process.env.ASSETS_DATA_SPREADSHEET_ID!;
const LOANS_DATA_SPREADSHEET_ID: string =
  process.env.LOANS_DATA_SPREADSHEET_ID!;

/**
 * Base function to fetch and parse data from a Google Apps Script web app URL.
 * @param spreadsheetId The ID of the Google Spreadsheet.
 * @returns A promise that resolves to SheetData.
 * @throws An error if the fetch or parsing fails.
 */
async function fetchSpreadsheetData(spreadsheetId: string): Promise<SheetData> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.append("spreadsheetId", spreadsheetId);

  const response = await fetch(url.toString());
  const result = await response.json();

  if (!response.ok || result.status === "error") {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  const rows: Record<string, string>[] = result;

  if (!Array.isArray(rows)) {
    throw new Error(
      "Invalid data format received from the script. Expected a JSON array."
    );
  }

  if (rows.length === 0) {
    // If the sheet is empty, we don't have headers.
    // The calling component will have to handle this case.
    return { headers: [], rows: [] };
  }

  const headers = Object.keys(rows[0]);
  return { headers, rows };
}

/**
 * Base function to sync user changes to a Google Apps Script web app.
 * @param spreadsheetId The ID of the Google Spreadsheet.
 * @param changes Array of user changes to sync.
 * @returns A promise that resolves to the success message from the script.
 * @throws An error if the submission fails.
 */
async function syncUserChangesToSpreadsheet(
  spreadsheetId: string,
  changes: Array<{
    changeType: "CREATE" | "UPDATE" | "DELETE";
    userId: string;
    userData?: Record<string, string>;
  }>
): Promise<{ message: string }> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.append("spreadsheetId", spreadsheetId);
  url.searchParams.append("action", "syncChanges");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(changes),
    mode: "cors",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result;
}

/**
 * Base function to sync asset changes to a Google Apps Script web app.
 * @param spreadsheetId The ID of the Google Spreadsheet.
 * @param changes Array of asset changes to sync.
 * @returns A promise that resolves to the success message from the script.
 * @throws An error if the submission fails.
 */
async function syncAssetChangesToSpreadsheet(
  spreadsheetId: string,
  changes: Array<{
    changeType: "CREATE" | "UPDATE" | "DELETE";
    assetId: string;
    assetData?: Record<string, string>;
  }>
): Promise<{ message: string }> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.append("spreadsheetId", spreadsheetId);
  url.searchParams.append("action", "syncAssetChanges");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(changes),
    mode: "cors",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result;
}

/**
 * Base function to sync loan changes to a Google Apps Script web app.
 * @param spreadsheetId The ID of the Google Spreadsheet.
 * @param changes Array of loan changes to sync.
 * @returns A promise that resolves to the success message from the script.
 * @throws An error if the submission fails.
 */
async function syncLoanChangesToSpreadsheet(
  spreadsheetId: string,
  changes: Array<{
    changeType: "CREATE" | "DELETE";
    loanId: string;
    loanData?: Record<string, string>;
  }>
): Promise<{ message: string }> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.append("spreadsheetId", spreadsheetId);
  url.searchParams.append("action", "syncLoanChanges");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(changes),
    mode: "cors",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result;
}

// --- User Data Spreadsheet Specific Functions ---

/**
 * Fetches data specifically from the user data spreadsheet.
 */
export async function fetchUserDataSpreadsheet(): Promise<SheetData> {
  return fetchSpreadsheetData(USER_DATA_SPREADSHEET_ID);
}

/**
 * Syncs user changes to the user data spreadsheet.
 * @param changes Array of user changes to sync.
 */
export async function syncUserChangesToUserDataSpreadsheet(
  changes: Array<{
    changeType: "CREATE" | "UPDATE" | "DELETE";
    userId: string;
    userData?: Record<string, string>;
  }>
): Promise<{ message: string }> {
  return syncUserChangesToSpreadsheet(USER_DATA_SPREADSHEET_ID, changes);
}

// --- Assets Data Spreadsheet Specific Functions ---

/**
 * Fetches data specifically from the assets data spreadsheet.
 */
export async function fetchAssetsDataSpreadsheet(): Promise<SheetData> {
  return fetchSpreadsheetData(ASSETS_DATA_SPREADSHEET_ID);
}

/**
 * Syncs asset changes to the assets data spreadsheet.
 * @param changes Array of asset changes to sync.
 */
export async function syncAssetChangesToAssetsDataSpreadsheet(
  changes: Array<{
    changeType: "CREATE" | "UPDATE" | "DELETE";
    assetId: string;
    assetData?: Record<string, string>;
  }>
): Promise<{ message: string }> {
  return syncAssetChangesToSpreadsheet(ASSETS_DATA_SPREADSHEET_ID, changes);
}

// --- Loans Data Spreadsheet Specific Functions ---

/**
 * Fetches data specifically from the loans data spreadsheet.
 */
export async function fetchLoansDataSpreadsheet(): Promise<SheetData> {
  return fetchSpreadsheetData(LOANS_DATA_SPREADSHEET_ID);
}

/**
 * Syncs loan changes to the loans data spreadsheet.
 * @param changes Array of loan changes to sync.
 */
export async function syncLoanChangesToLoansDataSpreadsheet(
  changes: Array<{
    changeType: "CREATE" | "DELETE";
    loanId: string;
    loanData?: Record<string, string>;
  }>
): Promise<{ message: string }> {
  return syncLoanChangesToSpreadsheet(LOANS_DATA_SPREADSHEET_ID, changes);
}
