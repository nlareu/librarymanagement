/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type {
  Asset,
  User,
  ActiveLoan,
  LoanHistoryRecord,
} from "./entities/index";

type StarterLoanData = {
  assetTitle: string;
  userCode: string;
  borrowDate: string;
  returnDate?: string;
  status: "Activo" | "Devuelto";
};

type StarterAssetData = Omit<Asset, "id"> & {
  marcFields?: { tag: string; value: string }[];
};

/**
 * Parses a JSON response, handling empty responses gracefully.
 * @param res The fetch Response object.
 * @param fileName The name of the file being parsed, for error logging.
 * @returns The parsed JSON data or an empty array if the file is empty.
 */
const parseResponse = async (res: Response, fileName: string) => {
  const text = await res.text();
  // An empty response body from fetch is a valid case (e.g. an empty file),
  // but response.json() will throw an error. We handle it gracefully.
  if (!text) {
    console.warn(
      `Starter data file '${fileName}' is empty, returning empty array.`
    );
    return [];
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Error parsing JSON from ${fileName}:`, e);
    // Re-throw to be caught by the outer try-catch block
    throw new Error(`Invalid JSON in ${fileName}`);
  }
};

/**
 * Loads and processes starter data from JSON files if no data exists in localStorage.
 * @returns An object containing the initial arrays for assets, users, and loan history.
 */
export async function loadStarterData() {
  // Load from starter JSON files
  const [assetsResponse, usersResponse, historyResponse] = await Promise.all([
    fetch("./starter-assets.json"),
    fetch("./starter-users.json"),
    fetch("./starter-loan-history.json"),
  ]);

  if (!assetsResponse.ok || !usersResponse.ok || !historyResponse.ok) {
    throw new Error("Failed to fetch one or more starter data files.");
  }

  const starterAssetsData: StarterAssetData[] = await parseResponse(
    assetsResponse,
    "starter-assets.json"
  );
  const starterUsersData = await parseResponse(
    usersResponse,
    "starter-users.json"
  );
  const starterHistoryData: StarterLoanData[] = await parseResponse(
    historyResponse,
    "starter-loan-history.json"
  );

  const usersMap = new Map<string, User>();
  const initialUsers: User[] = starterUsersData.map(
    (user: Omit<User, "id">) => {
      const newUser = { ...user, id: crypto.randomUUID() } as User;
      usersMap.set(newUser.userCode, newUser);
      return newUser;
    }
  );

  const assetsMap = new Map<string, Asset>();
  starterAssetsData.forEach((starterAsset) => {
    const { marcFields, ...baseAssetData } = starterAsset;
    const rawTitle = starterAsset.title; // Use raw title for map key

    const newAsset: Asset = {
      ...baseAssetData,
      id: crypto.randomUUID(),
      title: `245-${starterAsset.title}`,
      description: `520-${starterAsset.description}`,
      copies: 1, // Default to 1 copy if not specified
      volumes: 1,
      isLoanable: true,
    };

    if (marcFields) {
      for (const field of marcFields) {
        const prefixedValue = `${field.tag}-${field.value}`;
        switch (field.tag) {
          case "100":
            newAsset.author = prefixedValue;
            break;
          // Title is handled by default above, but this would override if needed
          case "245":
            newAsset.title = prefixedValue;
            break;
          case "650":
            if (!newAsset.subjects) newAsset.subjects = [];
            newAsset.subjects.push(prefixedValue);
            break;
          // Add other cases here if starter data contains them
          // e.g., case '020': newAsset.isbn = prefixedValue; break;
        }
      }
    }

    assetsMap.set(rawTitle, newAsset);
  });

  const initialActiveLoans: ActiveLoan[] = [];
  const initialCompletedLoans: LoanHistoryRecord[] = [];

  for (const loanData of starterHistoryData) {
    const user = usersMap.get(loanData.userCode);
    const asset = assetsMap.get(loanData.assetTitle);

    if (user && asset) {
      if (loanData.status === "Activo") {
        const newActiveLoan: ActiveLoan = {
          id: crypto.randomUUID(),
          assetId: asset.id,
          assetTitle: asset.title,
          userId: user.id,
          userName: `${user.lastName}, ${user.name}`,
          borrowDate: loanData.borrowDate,
        };
        initialActiveLoans.push(newActiveLoan);
      } else if (loanData.status === "Devuelto" && loanData.returnDate) {
        const newHistoryRecord: LoanHistoryRecord = {
          id: crypto.randomUUID(),
          assetId: asset.id,
          assetTitle: asset.title,
          userId: user.id,
          userName: `${user.lastName}, ${user.name}`,
          borrowDate: loanData.borrowDate,
          returnDate: loanData.returnDate,
        };
        initialCompletedLoans.push(newHistoryRecord);
      }
    }
  }

  // Set a different number of copies for some assets for demonstration
  const duneAsset = assetsMap.get("Dune");
  if (duneAsset) duneAsset.copies = 3;

  const matrixAsset = assetsMap.get("The Matrix");
  if (matrixAsset) matrixAsset.copies = 2;

  const initialAssets = Array.from(assetsMap.values());

  return {
    initialAssets,
    initialUsers,
    initialActiveLoans,
    initialCompletedLoans,
  };
}
