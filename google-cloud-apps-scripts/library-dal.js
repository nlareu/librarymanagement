/**
 * Handles HTTP GET requests to the web app.
 * Fetches all data from the first sheet of a specified Google Spreadsheet
 * and returns it as a JSON array of objects.
 *
 * @param {Object} e The event parameter for a web app request.
 * @returns {ContentService.TextOutput} A JSON representation of the sheet data.
 */
function doGet(e) {
  try {
    const spreadsheetId = e.parameter.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error("Missing 'spreadsheetId' parameter in the URL.");
    }

    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheets()[0]; // Fetches the very first sheet.

    // Get all data from the sheet.
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    // If there's no data or only a header row, return an empty array.
    if (values.length < 2) {
      return createJsonResponse([]);
    }

    const headers = values[0];
    const data = [];

    // Start from the second row (index 1) to skip the headers.
    for (let i = 1; i < values.length; i++) {
      const rowObject = {};
      const row = values[i];

      // Map each cell in the row to its corresponding header.
      headers.forEach((header, index) => {
        // Ensure the header is a clean string before using as a key.
        const headerKey = String(header).trim();
        if (headerKey) {
          rowObject[headerKey] = row[index];
        }
      });

      // Only add the row if it's not empty.
      if (Object.keys(rowObject).length > 0) {
        data.push(rowObject);
      }
    }

    return createJsonResponse(data);
  } catch (error) {
    // Log the error for debugging.
    Logger.log(error.toString());

    // Return a JSON error response.
    const errorResponse = {
      status: "error",
      message: error.message,
    };
    return createJsonResponse(errorResponse);
  }
}

/**
 * Helper function to create a standardized JSON response with CORS headers.
 * @param {Object|Array} data The data to stringify and return.
 * @returns {ContentService.TextOutput} The configured text output for the web app.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  let responseString;
  let output;

  // Handle POST request
  try {
    const data = JSON.parse(e.postData.contents);
    const action = e.parameter.action;

    const spreadsheetId = e.parameter.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error("Missing 'spreadsheetId' parameter in the URL.");
    }

    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheets()[0];

    let result;

    if (action === "syncChanges") {
      // Handle syncing user changes
      result = handleSyncChanges(sheet, data);
    } else if (action === "syncAssetChanges") {
      // Handle syncing asset changes
      result = handleSyncAssetChanges(sheet, data);
    } else {
      // Default behavior: append a single row
      const headers = sheet.getDataRange().getValues()[0];
      const newRow = [];
      headers.forEach((header) => {
        newRow.push(data[header] !== undefined ? data[header] : "");
      });
      sheet.appendRow(newRow);

      result = {
        status: "success",
        message: "Row added successfully.",
      };
    }

    responseString = JSON.stringify(result);
  } catch (err) {
    responseString = JSON.stringify({ status: "error", message: err.message });
  }

  // Create the final TextOutput object with the response string
  output = ContentService.createTextOutput(responseString);
  output.setMimeType(ContentService.MimeType.JSON);
  output.addHeader("Access-Control-Allow-Origin", "*");
  output.addHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  output.addHeader("Access-Control-Allow-Headers", "Content-Type");

  return output;
}

function doOptions(e) {
  // Handle preflight CORS requests
  const output = ContentService.createTextOutput("");
  output.setMimeType(ContentService.MimeType.JSON);
  output.addHeader("Access-Control-Allow-Origin", "*");
  output.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  output.addHeader("Access-Control-Allow-Headers", "Content-Type");
  return output;
}

/**
 * Handles syncing user changes to the spreadsheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {Array} changes Array of user changes to apply.
 * @returns {Object} Success response.
 */
function handleSyncChanges(sheet, changes) {
  for (const change of changes) {
    switch (change.changeType) {
      case "CREATE":
        if (change.userData) {
          appendUserRow(sheet, change.userData);
        }
        break;
      case "UPDATE":
        if (change.userData) {
          updateUserRow(sheet, change.userId, change.userData);
        }
        break;
      case "DELETE":
        deleteUserRow(sheet, change.userId);
        break;
    }
  }

  return {
    status: "success",
    message: `Successfully processed ${changes.length} user changes.`,
  };
}

/**
 * Appends a new user row to the sheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {Object} userData The user data to append.
 */
function appendUserRow(sheet, userData) {
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = [];
  headers.forEach((header) => {
    newRow.push(userData[header] !== undefined ? userData[header] : "");
  });
  sheet.appendRow(newRow);
}

/**
 * Updates an existing user row in the sheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {string} userId The ID of the user to update.
 * @param {Object} userData The new user data.
 */
function updateUserRow(sheet, userId, userData) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  // Find the row with the matching user ID
  const userIdColIndex = headers.indexOf("id");
  if (userIdColIndex === -1) return; // No ID column found

  for (let i = 1; i < values.length; i++) {
    if (values[i][userIdColIndex] === userId) {
      // Update this row
      const updatedRow = [];
      headers.forEach((header) => {
        updatedRow.push(
          userData[header] !== undefined
            ? userData[header]
            : values[i][headers.indexOf(header)]
        );
      });

      // Replace the entire row
      const range = sheet.getRange(i + 1, 1, 1, headers.length);
      range.setValues([updatedRow]);
      break;
    }
  }
}

/**
 * Deletes a user row from the sheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {string} userId The ID of the user to delete.
 */
function deleteUserRow(sheet, userId) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  // Find the row with the matching user ID
  const userIdColIndex = headers.indexOf("id");
  if (userIdColIndex === -1) return; // No ID column found

  for (let i = 1; i < values.length; i++) {
    if (values[i][userIdColIndex] === userId) {
      // Delete this row
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

/**
 * Replaces all data in the sheet with new data.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {Array} allData Array of all user data to replace existing data.
 * @returns {Object} Success response.
 */
function handleReplaceAll(sheet, allData) {
  if (allData.length === 0) {
    return {
      status: "success",
      message: "No data provided to replace.",
    };
  }

  // Clear existing data except headers
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  // Add all new data
  const headers = sheet.getDataRange().getValues()[0];
  const newRows = allData.map((userData) => {
    const row = [];
    headers.forEach((header) => {
      row.push(userData[header] !== undefined ? userData[header] : "");
    });
    return row;
  });

  if (newRows.length > 0) {
    const range = sheet.getRange(2, 1, newRows.length, headers.length);
    range.setValues(newRows);
  }

  return {
    status: "success",
    message: `Successfully replaced all data with ${allData.length} records.`,
  };
}

/**
 * Handles syncing asset changes to the spreadsheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {Array} changes Array of asset changes to apply.
 * @returns {Object} Success response.
 */
function handleSyncAssetChanges(sheet, changes) {
  for (const change of changes) {
    switch (change.changeType) {
      case "CREATE":
        if (change.assetData) {
          appendAssetRow(sheet, change.assetData);
        }
        break;
      case "UPDATE":
        if (change.assetData) {
          updateAssetRow(sheet, change.assetId, change.assetData);
        }
        break;
      case "DELETE":
        deleteAssetRow(sheet, change.assetId);
        break;
    }
  }

  return {
    status: "success",
    message: `Successfully processed ${changes.length} asset changes.`,
  };
}

/**
 * Appends a new asset row to the sheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {Object} assetData The asset data to append.
 */
function appendAssetRow(sheet, assetData) {
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = [];
  headers.forEach((header) => {
    newRow.push(assetData[header] !== undefined ? assetData[header] : "");
  });
  sheet.appendRow(newRow);
}

/**
 * Updates an existing asset row in the sheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {string} assetId The ID of the asset to update.
 * @param {Object} assetData The new asset data.
 */
function updateAssetRow(sheet, assetId, assetData) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  // Find the row with the matching asset ID
  const assetIdColIndex = headers.indexOf("id");
  if (assetIdColIndex === -1) return; // No ID column found

  for (let i = 1; i < values.length; i++) {
    if (values[i][assetIdColIndex] === assetId) {
      // Update this row
      const updatedRow = [];
      headers.forEach((header) => {
        updatedRow.push(
          assetData[header] !== undefined
            ? assetData[header]
            : values[i][headers.indexOf(header)]
        );
      });

      // Replace the entire row
      const range = sheet.getRange(i + 1, 1, 1, headers.length);
      range.setValues([updatedRow]);
      break;
    }
  }
}

/**
 * Deletes an asset row from the sheet.
 * @param {SpreadsheetApp.Sheet} sheet The sheet to modify.
 * @param {string} assetId The ID of the asset to delete.
 */
function deleteAssetRow(sheet, assetId) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];

  // Find the row with the matching asset ID
  const assetIdColIndex = headers.indexOf("id");
  if (assetIdColIndex === -1) return; // No ID column found

  for (let i = 1; i < values.length; i++) {
    if (values[i][assetIdColIndex] === assetId) {
      // Delete this row
      sheet.deleteRow(i + 1);
      break;
    }
  }
}
