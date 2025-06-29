use std::sync::Mutex;
use tauri::{AppHandle, State};
use crate::database::{Database, Asset, User, ActiveLoan, LoanHistoryRecord};

pub type DbState = Mutex<Option<Database>>;

#[tauri::command]
pub async fn init_database(app_handle: AppHandle, state: State<'_, DbState>) -> Result<(), String> {
    let mut db = state.lock().map_err(|e| e.to_string())?;
    
    match Database::new(&app_handle) {
        Ok(database) => {
            *db = Some(database);
            Ok(())
        }
        Err(e) => Err(format!("Failed to initialize database: {}", e))
    }
}

#[tauri::command]
pub async fn get_assets(state: State<'_, DbState>) -> Result<Vec<Asset>, String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.get_assets().map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}

#[tauri::command]
pub async fn save_assets(assets: Vec<Asset>, state: State<'_, DbState>) -> Result<(), String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.save_assets(&assets).map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}

#[tauri::command]
pub async fn get_users(state: State<'_, DbState>) -> Result<Vec<User>, String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.get_users().map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}

#[tauri::command]
pub async fn save_users(users: Vec<User>, state: State<'_, DbState>) -> Result<(), String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.save_users(&users).map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}

#[tauri::command]
pub async fn get_active_loans(state: State<'_, DbState>) -> Result<Vec<ActiveLoan>, String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.get_active_loans().map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}

#[tauri::command]
pub async fn save_active_loans(loans: Vec<ActiveLoan>, state: State<'_, DbState>) -> Result<(), String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.save_active_loans(&loans).map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}

#[tauri::command]
pub async fn get_loan_history(state: State<'_, DbState>) -> Result<Vec<LoanHistoryRecord>, String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.get_loan_history().map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}

#[tauri::command]
pub async fn save_loan_history(history: Vec<LoanHistoryRecord>, state: State<'_, DbState>) -> Result<(), String> {
    let db = state.lock().map_err(|e| e.to_string())?;
    
    match db.as_ref() {
        Some(database) => database.save_loan_history(&history).map_err(|e| e.to_string()),
        None => Err("Database not initialized".to_string())
    }
}
