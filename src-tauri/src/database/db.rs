use rusqlite::{Connection, Result as SqliteResult};
use tauri::{AppHandle, Manager};
use crate::database::models::*;

pub struct Database {
    connection: Connection,
}

impl Database {
    pub fn new(app_handle: &AppHandle) -> SqliteResult<Self> {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .expect("Failed to get app data directory");
        
        std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
        
        let db_path = app_dir.join("library.db");
        let connection = Connection::open(db_path)?;
        
        let db = Database { connection };
        db.init_tables()?;
        Ok(db)
    }

    fn init_tables(&self) -> SqliteResult<()> {
        // Create assets table
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS assets (
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
            )",
            [],
        )?;

        // Create users table
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                user_code TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                type TEXT NOT NULL,
                grade TEXT
            )",
            [],
        )?;

        // Create active_loans table
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS active_loans (
                id TEXT PRIMARY KEY,
                asset_id TEXT NOT NULL,
                asset_title TEXT NOT NULL,
                user_id TEXT NOT NULL,
                user_name TEXT NOT NULL,
                borrow_date TEXT NOT NULL,
                FOREIGN KEY (asset_id) REFERENCES assets (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )",
            [],
        )?;

        // Create loan_history table
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS loan_history (
                id TEXT PRIMARY KEY,
                asset_id TEXT NOT NULL,
                asset_title TEXT NOT NULL,
                user_id TEXT NOT NULL,
                user_name TEXT NOT NULL,
                borrow_date TEXT NOT NULL,
                return_date TEXT NOT NULL
            )",
            [],
        )?;

        Ok(())
    }

    // Asset operations
    pub fn get_assets(&self) -> SqliteResult<Vec<Asset>> {
        let mut stmt = self.connection.prepare(
            "SELECT id, title, type, description, registration_number, signature, isbn, 
             author, publisher, publication_place, edition, publication_year, 
             collection_title, collection_number, volumes, copies, is_loanable, 
             subjects, ibic_subjects FROM assets"
        )?;

        let asset_iter = stmt.query_map([], |row| {
            Ok(Asset {
                id: row.get(0)?,
                title: row.get(1)?,
                asset_type: row.get(2)?,
                description: row.get(3)?,
                registration_number: row.get(4)?,
                signature: row.get(5)?,
                isbn: row.get(6)?,
                author: row.get(7)?,
                publisher: row.get(8)?,
                publication_place: row.get(9)?,
                edition: row.get(10)?,
                publication_year: row.get(11)?,
                collection_title: row.get(12)?,
                collection_number: row.get(13)?,
                volumes: row.get(14)?,
                copies: row.get(15)?,
                is_loanable: row.get(16)?,
                subjects: {
                    let json_str: Option<String> = row.get(17)?;
                    json_str.and_then(|s| serde_json::from_str(&s).ok())
                },
                ibic_subjects: {
                    let json_str: Option<String> = row.get(18)?;
                    json_str.and_then(|s| serde_json::from_str(&s).ok())
                },
            })
        })?;

        asset_iter.collect()
    }

    pub fn save_assets(&self, assets: &[Asset]) -> SqliteResult<()> {
        // Clear existing assets
        self.connection.execute("DELETE FROM assets", [])?;

        let mut stmt = self.connection.prepare(
            "INSERT INTO assets (id, title, type, description, registration_number, signature, 
             isbn, author, publisher, publication_place, edition, publication_year, 
             collection_title, collection_number, volumes, copies, is_loanable, subjects, ibic_subjects) 
             VALUES (:id, :title, :type, :description, :registration_number, :signature, 
             :isbn, :author, :publisher, :publication_place, :edition, :publication_year, 
             :collection_title, :collection_number, :volumes, :copies, :is_loanable, :subjects, :ibic_subjects)"
        )?;

        for asset in assets {
            let subjects_json = asset.subjects.as_ref()
                .map(|s| serde_json::to_string(s).unwrap_or_else(|_| "[]".to_string()));
            let ibic_subjects_json = asset.ibic_subjects.as_ref()
                .map(|s| serde_json::to_string(s).unwrap_or_else(|_| "[]".to_string()));
                
            stmt.execute(&[
                (":id", &asset.id as &dyn rusqlite::ToSql),
                (":title", &asset.title as &dyn rusqlite::ToSql),
                (":type", &asset.asset_type as &dyn rusqlite::ToSql),
                (":description", &asset.description as &dyn rusqlite::ToSql),
                (":registration_number", &asset.registration_number as &dyn rusqlite::ToSql),
                (":signature", &asset.signature as &dyn rusqlite::ToSql),
                (":isbn", &asset.isbn as &dyn rusqlite::ToSql),
                (":author", &asset.author as &dyn rusqlite::ToSql),
                (":publisher", &asset.publisher as &dyn rusqlite::ToSql),
                (":publication_place", &asset.publication_place as &dyn rusqlite::ToSql),
                (":edition", &asset.edition as &dyn rusqlite::ToSql),
                (":publication_year", &asset.publication_year as &dyn rusqlite::ToSql),
                (":collection_title", &asset.collection_title as &dyn rusqlite::ToSql),
                (":collection_number", &asset.collection_number as &dyn rusqlite::ToSql),
                (":volumes", &asset.volumes as &dyn rusqlite::ToSql),
                (":copies", &asset.copies as &dyn rusqlite::ToSql),
                (":is_loanable", &asset.is_loanable as &dyn rusqlite::ToSql),
                (":subjects", &subjects_json as &dyn rusqlite::ToSql),
                (":ibic_subjects", &ibic_subjects_json as &dyn rusqlite::ToSql),
            ])?;
        }

        Ok(())
    }

    // User operations
    pub fn get_users(&self) -> SqliteResult<Vec<User>> {
        let mut stmt = self.connection.prepare(
            "SELECT id, user_code, name, last_name, type, grade FROM users"
        )?;

        let user_iter = stmt.query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                user_code: row.get(1)?,
                name: row.get(2)?,
                last_name: row.get(3)?,
                user_type: row.get(4)?,
                grade: row.get(5)?,
            })
        })?;

        user_iter.collect()
    }

    pub fn save_users(&self, users: &[User]) -> SqliteResult<()> {
        self.connection.execute("DELETE FROM users", [])?;

        let mut stmt = self.connection.prepare(
            "INSERT INTO users (id, user_code, name, last_name, type, grade) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
        )?;

        for user in users {
            stmt.execute((
                &user.id,
                &user.user_code,
                &user.name,
                &user.last_name,
                &user.user_type,
                &user.grade,
            ))?;
        }

        Ok(())
    }

    // Active loan operations
    pub fn get_active_loans(&self) -> SqliteResult<Vec<ActiveLoan>> {
        let mut stmt = self.connection.prepare(
            "SELECT id, asset_id, asset_title, user_id, user_name, borrow_date FROM active_loans"
        )?;

        let loan_iter = stmt.query_map([], |row| {
            Ok(ActiveLoan {
                id: row.get(0)?,
                asset_id: row.get(1)?,
                asset_title: row.get(2)?,
                user_id: row.get(3)?,
                user_name: row.get(4)?,
                borrow_date: row.get(5)?,
            })
        })?;

        loan_iter.collect()
    }

    pub fn save_active_loans(&self, loans: &[ActiveLoan]) -> SqliteResult<()> {
        self.connection.execute("DELETE FROM active_loans", [])?;

        let mut stmt = self.connection.prepare(
            "INSERT INTO active_loans (id, asset_id, asset_title, user_id, user_name, borrow_date) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
        )?;

        for loan in loans {
            stmt.execute((
                &loan.id,
                &loan.asset_id,
                &loan.asset_title,
                &loan.user_id,
                &loan.user_name,
                &loan.borrow_date,
            ))?;
        }

        Ok(())
    }

    // Loan history operations
    pub fn get_loan_history(&self) -> SqliteResult<Vec<LoanHistoryRecord>> {
        let mut stmt = self.connection.prepare(
            "SELECT id, asset_id, asset_title, user_id, user_name, borrow_date, return_date FROM loan_history"
        )?;

        let history_iter = stmt.query_map([], |row| {
            Ok(LoanHistoryRecord {
                id: row.get(0)?,
                asset_id: row.get(1)?,
                asset_title: row.get(2)?,
                user_id: row.get(3)?,
                user_name: row.get(4)?,
                borrow_date: row.get(5)?,
                return_date: row.get(6)?,
            })
        })?;

        history_iter.collect()
    }

    pub fn save_loan_history(&self, history: &[LoanHistoryRecord]) -> SqliteResult<()> {
        self.connection.execute("DELETE FROM loan_history", [])?;

        let mut stmt = self.connection.prepare(
            "INSERT INTO loan_history (id, asset_id, asset_title, user_id, user_name, borrow_date, return_date) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)"
        )?;

        for record in history {
            stmt.execute((
                &record.id,
                &record.asset_id,
                &record.asset_title,
                &record.user_id,
                &record.user_name,
                &record.borrow_date,
                &record.return_date,
            ))?;
        }

        Ok(())
    }
}
