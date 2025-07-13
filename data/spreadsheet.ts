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

// The ID of the specific spreadsheet for user data.
// In a real application, this would likely come from a configuration file.
// const TEST_DATA_SPREADSHEET_ID = "1NpKpSSxHAg4HvKNhxeVJ2uhsoR68PGZml5xJLAmuU_0";
const USER_DATA_SPREADSHEET_ID = "1wRM66xh6MLdhTMRW6QBkZjY3jmsW3IJ5_aTmEMFxyLQ";

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
 * Base function to write a new row to a Google Apps Script web app.
 * @param spreadsheetId The ID of the Google Spreadsheet.
 * @param rowData The data for the new row.
 * @returns A promise that resolves to the success message from the script.
 * @throws An error if the submission fails.
 */
async function writeToSpreadsheet(
  spreadsheetId: string,
  rowData: Record<string, string>
): Promise<{ message: string }> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.append("spreadsheetId", spreadsheetId);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(rowData),
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
 * Base function to clear and replace all data in a Google Apps Script web app.
 * @param spreadsheetId The ID of the Google Spreadsheet.
 * @param allData Array of row data to replace all existing data.
 * @returns A promise that resolves to the success message from the script.
 * @throws An error if the submission fails.
 */
async function replaceAllSpreadsheetData(
  spreadsheetId: string,
  allData: Record<string, string>[]
): Promise<{ message: string }> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.append("spreadsheetId", spreadsheetId);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(allData),
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

// --- User Data Spreadsheet Specific Functions ---

/**
 * Fetches data specifically from the user data spreadsheet.
 */
export async function fetchUserDataSpreadsheet(): Promise<SheetData> {
  return fetchSpreadsheetData(USER_DATA_SPREADSHEET_ID);
}

/**
 * Writes a new row specifically to the user data spreadsheet.
 * @param newRowData The data for the new row.
 */
export async function writeToUserDataSpreadsheet(
  newRowData: Record<string, string>
): Promise<{ message: string }> {
  return writeToSpreadsheet(USER_DATA_SPREADSHEET_ID, newRowData);
}

/**
 * Replaces all data specifically in the user data spreadsheet.
 * @param allUserData Array of user data to replace all existing data.
 */
export async function replaceAllUserDataSpreadsheet(
  allUserData: Record<string, string>[]
): Promise<{ message: string }> {
  return replaceAllSpreadsheetData(USER_DATA_SPREADSHEET_ID, allUserData);
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
