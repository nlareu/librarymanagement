/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Direct SQLite Database Seeding Script (TypeScript)
 * This script directly accesses the SQLite database file to seed it with test data
 * Can be run independently without the Tauri app running
 */

import * as sqlite3 from "sqlite3";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import type {
  Asset,
  User,
  ActiveLoan,
  LoanHistoryRecord,
} from "../entities/index";

// Enable verbose mode for debugging
const sqlite = sqlite3.verbose();

/**
 * Get the database path where Tauri stores the SQLite file
 * This follows the same pattern as the Rust code
 */
function getDatabasePath(): string {
  // On macOS, Tauri stores app data in ~/Library/Application Support/{app_name}
  // On Windows: %APPDATA%/{app_name}
  // On Linux: ~/.local/share/{app_name}

  const platform = os.platform();
  const homeDir = os.homedir();

  let appDataDir: string;

  if (platform === "darwin") {
    appDataDir = path.join(
      homeDir,
      "Library",
      "Application Support",
      "com.tauri.dev"
    );
  } else if (platform === "win32") {
    appDataDir = path.join(
      process.env.APPDATA || path.join(homeDir, "AppData", "Roaming"),
      "com.tauri.dev"
    );
  } else {
    appDataDir = path.join(homeDir, ".local", "share", "com.tauri.dev");
  }

  // Create directory if it doesn't exist
  if (!fs.existsSync(appDataDir)) {
    fs.mkdirSync(appDataDir, { recursive: true });
  }

  return path.join(appDataDir, "library.db");
}

/**
 * Generate a UUID
 */
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate user code
 */
function generateUserCode(index: number): string {
  return `USR-${String(index + 1).padStart(4, "0")}`;
}

/**
 * Format date to ISO string
 */
function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Test data
 */
const testAssets: Omit<Asset, "id">[] = [
  {
    title: "Dune",
    type: "Libro",
    description:
      "Una novela de ciencia ficción sobre la búsqueda de un joven noble en un planeta desértico.",
    isbn: "978-0-441-17271-9",
    author: "Frank Herbert",
    publisher: "Ace Books",
    publicationPlace: "New York",
    edition: "1st",
    publicationYear: "1965",
    subjects: ["Ciencia Ficción", "Novela"],
    ibicSubjects: ["FL", "FLS"],
    registrationNumber: "REG-001",
    signature: "SIG-DUNE-001",
    volumes: 1,
    copies: 3,
    isLoanable: true,
  },
  {
    title: "The Matrix",
    type: "Película",
    description:
      "Un hacker informático aprende sobre la verdadera naturaleza de su realidad.",
    registrationNumber: "REG-002",
    signature: "SIG-MATRIX-001",
    volumes: 1,
    copies: 2,
    isLoanable: true,
    subjects: ["Ciencia Ficción", "Acción"],
    ibicSubjects: ["ATFX", "ATFS"],
  },
  {
    title: "To Kill a Mockingbird",
    type: "Libro",
    description:
      "Una novela de Harper Lee ambientada en el sur de Estados Unidos durante la década de 1930.",
    isbn: "978-0-06-112008-4",
    author: "Harper Lee",
    publisher: "J.B. Lippincott & Co.",
    publicationPlace: "Philadelphia",
    edition: "1st",
    publicationYear: "1960",
    subjects: ["Literatura", "Drama"],
    ibicSubjects: ["FA", "FBA"],
    registrationNumber: "REG-003",
    signature: "SIG-MOCK-001",
    volumes: 1,
    copies: 2,
    isLoanable: true,
  },
  {
    title: "Inception",
    type: "Película",
    description:
      "Un ladrón que roba secretos corporativos a través del uso de tecnología de sueño compartido.",
    registrationNumber: "REG-004",
    signature: "SIG-INCEP-001",
    volumes: 1,
    copies: 1,
    isLoanable: true,
    subjects: ["Ciencia Ficción", "Thriller"],
    ibicSubjects: ["ATFX", "ATFH"],
  },
  {
    title: "1984",
    type: "Libro",
    description:
      "Una novela distópica de ciencia ficción social de George Orwell.",
    isbn: "978-0-452-28423-4",
    author: "George Orwell",
    publisher: "Secker & Warburg",
    publicationPlace: "London",
    edition: "1st",
    publicationYear: "1949",
    subjects: ["Ciencia Ficción", "Distopía"],
    ibicSubjects: ["FL", "FLS"],
    registrationNumber: "REG-005",
    signature: "SIG-1984-001",
    volumes: 1,
    copies: 4,
    isLoanable: true,
  },
];

const testUsers: Omit<User, "id" | "userCode">[] = [
  {
    name: "María",
    lastName: "García",
    type: "Estudiante",
    grade: "10°",
  },
  {
    name: "Juan",
    lastName: "Rodríguez",
    type: "Profesor",
    grade: "N/A",
  },
  {
    name: "Ana",
    lastName: "Martínez",
    type: "Estudiante",
    grade: "11°",
  },
  {
    name: "Carlos",
    lastName: "López",
    type: "Estudiante",
    grade: "9°",
  },
  {
    name: "Sofia",
    lastName: "Hernández",
    type: "Profesor",
    grade: "N/A",
  },
];

/**
 * Initialize database tables
 */
function initializeTables(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create assets table
      db.run(
        `CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        registration_number TEXT,
        signature TEXT,
        isbn TEXT,
        author TEXT,
        publisher TEXT,
        publication_place TEXT,
        edition TEXT,
        publication_year TEXT,
        collection_title TEXT,
        collection_number TEXT,
        volumes INTEGER,
        copies INTEGER,
        is_loanable BOOLEAN,
        subjects TEXT,
        ibic_subjects TEXT
      )`,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
        }
      );

      // Create users table
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        user_code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        type TEXT NOT NULL,
        grade TEXT
      )`,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
        }
      );

      // Create active_loans table
      db.run(
        `CREATE TABLE IF NOT EXISTS active_loans (
        id TEXT PRIMARY KEY,
        asset_id TEXT NOT NULL,
        asset_title TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        borrow_date TEXT NOT NULL,
        FOREIGN KEY (asset_id) REFERENCES assets (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
        }
      );

      // Create loan_history table
      db.run(
        `CREATE TABLE IF NOT EXISTS loan_history (
        id TEXT PRIMARY KEY,
        asset_id TEXT NOT NULL,
        asset_title TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        borrow_date TEXT NOT NULL,
        return_date TEXT NOT NULL
      )`,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  });
}

/**
 * Clear all data from database
 */
function clearDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM loan_history", (err) => {
        if (err) reject(err);
      });
      db.run("DELETE FROM active_loans", (err) => {
        if (err) reject(err);
      });
      db.run("DELETE FROM users", (err) => {
        if (err) reject(err);
      });
      db.run("DELETE FROM assets", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

/**
 * Insert assets into database
 */
function insertAssets(db: sqlite3.Database, assets: Asset[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO assets (
      id, title, type, description, registration_number, signature, isbn,
      author, publisher, publication_place, edition, publication_year,
      collection_title, collection_number, volumes, copies, is_loanable,
      subjects, ibic_subjects
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    let completed = 0;
    const total = assets.length;

    assets.forEach((asset) => {
      stmt.run(
        [
          asset.id,
          asset.title,
          asset.type,
          asset.description,
          asset.registrationNumber || null,
          asset.signature || null,
          asset.isbn || null,
          asset.author || null,
          asset.publisher || null,
          asset.publicationPlace || null,
          asset.edition || null,
          asset.publicationYear || null,
          asset.collectionTitle || null,
          asset.collectionNumber || null,
          asset.volumes || null,
          asset.copies || null,
          asset.isLoanable ? 1 : 0,
          asset.subjects ? JSON.stringify(asset.subjects) : null,
          asset.ibicSubjects ? JSON.stringify(asset.ibicSubjects) : null,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          completed++;
          if (completed === total) {
            stmt.finalize();
            resolve();
          }
        }
      );
    });
  });
}

/**
 * Insert users into database
 */
function insertUsers(db: sqlite3.Database, users: User[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO users (
      id, user_code, name, last_name, type, grade
    ) VALUES (?, ?, ?, ?, ?, ?)`);

    let completed = 0;
    const total = users.length;

    users.forEach((user) => {
      stmt.run(
        [
          user.id,
          user.userCode,
          user.name,
          user.lastName,
          user.type,
          user.grade || null,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          completed++;
          if (completed === total) {
            stmt.finalize();
            resolve();
          }
        }
      );
    });
  });
}

/**
 * Insert active loans into database
 */
function insertActiveLoans(
  db: sqlite3.Database,
  loans: ActiveLoan[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (loans.length === 0) {
      resolve();
      return;
    }

    const stmt = db.prepare(`INSERT INTO active_loans (
      id, asset_id, asset_title, user_id, user_name, borrow_date
    ) VALUES (?, ?, ?, ?, ?, ?)`);

    let completed = 0;
    const total = loans.length;

    loans.forEach((loan) => {
      stmt.run(
        [
          loan.id,
          loan.assetId,
          loan.assetTitle,
          loan.userId,
          loan.userName,
          loan.borrowDate,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          completed++;
          if (completed === total) {
            stmt.finalize();
            resolve();
          }
        }
      );
    });
  });
}

/**
 * Insert loan history into database
 */
function insertLoanHistory(
  db: sqlite3.Database,
  history: LoanHistoryRecord[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (history.length === 0) {
      resolve();
      return;
    }

    const stmt = db.prepare(`INSERT INTO loan_history (
      id, asset_id, asset_title, user_id, user_name, borrow_date, return_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    let completed = 0;
    const total = history.length;

    history.forEach((record) => {
      stmt.run(
        [
          record.id,
          record.assetId,
          record.assetTitle,
          record.userId,
          record.userName,
          record.borrowDate,
          record.returnDate,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          completed++;
          if (completed === total) {
            stmt.finalize();
            resolve();
          }
        }
      );
    });
  });
}

/**
 * Generate complete seed data with IDs
 */
function generateSeedData() {
  // Create assets with IDs
  const assets: Asset[] = testAssets.map((asset) => ({
    ...asset,
    id: generateId(),
  }));

  // Create users with IDs and user codes
  const users: User[] = testUsers.map((user, index) => ({
    ...user,
    id: generateId(),
    userCode: generateUserCode(index),
  }));

  // Create some active loans (2 loans)
  const activeLoans: ActiveLoan[] = [
    {
      id: generateId(),
      assetId: assets[0].id, // Dune
      assetTitle: assets[0].title,
      userId: users[0].id, // María García
      userName: `${users[0].name} ${users[0].lastName}`,
      borrowDate: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
    },
    {
      id: generateId(),
      assetId: assets[2].id, // To Kill a Mockingbird
      assetTitle: assets[2].title,
      userId: users[2].id, // Ana Martínez
      userName: `${users[2].name} ${users[2].lastName}`,
      borrowDate: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
    },
  ];

  // Create some loan history (3 historical records)
  const loanHistory: LoanHistoryRecord[] = [
    {
      id: generateId(),
      assetId: assets[1].id, // The Matrix
      assetTitle: assets[1].title,
      userId: users[1].id, // Juan Rodríguez
      userName: `${users[1].name} ${users[1].lastName}`,
      borrowDate: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
      returnDate: formatDate(new Date(Date.now() - 23 * 24 * 60 * 60 * 1000)), // 23 days ago
    },
    {
      id: generateId(),
      assetId: assets[3].id, // Inception
      assetTitle: assets[3].title,
      userId: users[3].id, // Carlos López
      userName: `${users[3].name} ${users[3].lastName}`,
      borrowDate: formatDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)), // 20 days ago
      returnDate: formatDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)), // 15 days ago
    },
    {
      id: generateId(),
      assetId: assets[4].id, // 1984
      assetTitle: assets[4].title,
      userId: users[4].id, // Sofia Hernández
      userName: `${users[4].name} ${users[4].lastName}`,
      borrowDate: formatDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)), // 45 days ago
      returnDate: formatDate(new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)), // 40 days ago
    },
  ];

  return {
    assets,
    users,
    activeLoans,
    loanHistory,
  };
}

/**
 * Main seeding function
 */
async function seedDatabase(clearFirst: boolean = false): Promise<void> {
  const dbPath = getDatabasePath();
  console.log(`🗃️  Database path: ${dbPath}`);

  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(dbPath, (err) => {
      if (err) {
        console.error("❌ Error opening database:", err.message);
        reject(err);
        return;
      }
      console.log("✅ Connected to SQLite database");
    });

    (async () => {
      try {
        console.log("🔧 Initializing database tables...");
        await initializeTables(db);

        if (clearFirst) {
          console.log("🧹 Clearing existing data...");
          await clearDatabase(db);
        }

        console.log("🌱 Generating seed data...");
        const { assets, users, activeLoans, loanHistory } = generateSeedData();

        console.log(`📚 Inserting ${assets.length} assets...`);
        await insertAssets(db, assets);

        console.log(`👥 Inserting ${users.length} users...`);
        await insertUsers(db, users);

        console.log(`📋 Inserting ${activeLoans.length} active loans...`);
        await insertActiveLoans(db, activeLoans);

        console.log(
          `📜 Inserting ${loanHistory.length} loan history records...`
        );
        await insertLoanHistory(db, loanHistory);

        console.log("🎉 Database seeding completed successfully!");
        console.log(`📊 Seeded data summary:`);
        console.log(`   - ${assets.length} assets`);
        console.log(`   - ${users.length} users`);
        console.log(`   - ${activeLoans.length} active loans`);
        console.log(`   - ${loanHistory.length} loan history records`);

        db.close((err) => {
          if (err) {
            console.error("❌ Error closing database:", err.message);
            reject(err);
          } else {
            console.log("✅ Database connection closed");
            resolve();
          }
        });
      } catch (error) {
        console.error("❌ Error during seeding:", error);
        db.close();
        reject(error);
      }
    })();
  });
}

/**
 * Clear database function
 */
async function clearDatabaseOnly(): Promise<void> {
  const dbPath = getDatabasePath();
  console.log(`🗃️  Database path: ${dbPath}`);

  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(dbPath, (err) => {
      if (err) {
        console.error("❌ Error opening database:", err.message);
        reject(err);
        return;
      }
      console.log("✅ Connected to SQLite database");
    });

    (async () => {
      try {
        console.log("🔧 Initializing database tables...");
        await initializeTables(db);

        console.log("🧹 Clearing all data...");
        await clearDatabase(db);

        console.log("✅ Database cleared successfully!");

        db.close((err) => {
          if (err) {
            console.error("❌ Error closing database:", err.message);
            reject(err);
          } else {
            console.log("✅ Database connection closed");
            resolve();
          }
        });
      } catch (error) {
        console.error("❌ Error during clearing:", error);
        db.close();
        reject(error);
      }
    })();
  });
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || "seed";

  if (command === "clear") {
    clearDatabaseOnly().catch((error) => {
      console.error("Failed to clear database:", error);
      process.exit(1);
    });
  } else if (command === "seed") {
    const clearFirst = args.includes("--clear");
    seedDatabase(clearFirst).catch((error) => {
      console.error("Failed to seed database:", error);
      process.exit(1);
    });
  } else {
    console.log("Usage:");
    console.log("  npm run seed:direct        - Seed the database");
    console.log("  npm run seed:direct clear  - Clear the database");
    console.log("  npm run seed:direct seed --clear - Clear and then seed");
  }
}

export { seedDatabase, clearDatabaseOnly, generateSeedData, getDatabasePath };
