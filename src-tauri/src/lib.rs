use std::sync::Mutex;

mod database;
mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .manage(Mutex::new(None) as DbState)
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      init_database,
      get_assets,
      save_assets,
      get_users,
      save_users,
      get_active_loans,
      save_active_loans,
      get_loan_history,
      save_loan_history
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
