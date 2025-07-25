/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export const messages = {
  title: "Sincronización de Datos",
  description:
    "Sincroniza los datos de usuarios, activos y préstamos entre el almacenamiento local y Google Spreadsheets.",

  // User sync messages
  userSyncDownTitle: "Descargar Usuarios desde Spreadsheet",
  userSyncDownDescription:
    "Descarga los datos de usuarios desde Google Spreadsheet y los guarda en el almacenamiento local.",
  userSyncDownButton: "⬇️ Descargar Usuarios desde Spreadsheet",

  userSyncUpTitle: "Subir Usuarios al Spreadsheet",
  userSyncUpDescription:
    "Sube los cambios pendientes de usuarios locales a Google Spreadsheet.",
  userSyncUpButton: "⬆️ Subir Usuarios al Spreadsheet",

  // Asset sync messages
  assetSyncDownTitle: "Descargar Activos desde Spreadsheet",
  assetSyncDownDescription:
    "Descarga los datos de activos desde Google Spreadsheet y los guarda en el almacenamiento local.",
  assetSyncDownButton: "⬇️ Descargar Activos desde Spreadsheet",

  assetSyncUpTitle: "Subir Activos al Spreadsheet",
  assetSyncUpDescription:
    "Sube los cambios pendientes de activos locales a Google Spreadsheet.",
  assetSyncUpButton: "⬆️ Subir Activos al Spreadsheet",

  // Loan sync messages
  loanSyncDownTitle: "Descargar Préstamos desde Spreadsheet",
  loanSyncDownDescription:
    "Descarga los datos de préstamos desde Google Spreadsheet y los guarda en el almacenamiento local.",
  loanSyncDownButton: "⬇️ Descargar Préstamos desde Spreadsheet",

  loanSyncUpTitle: "Subir Préstamos al Spreadsheet",
  loanSyncUpDescription:
    "Sube los cambios pendientes de préstamos locales a Google Spreadsheet.",
  loanSyncUpButton: "⬆️ Subir Préstamos al Spreadsheet",

  syncing: "Sincronizando...",

  // User sync status messages
  syncingUserDown: "Descargando datos de usuarios desde Google Spreadsheet...",
  syncingUserUp: "Subiendo cambios de usuarios a Google Spreadsheet...",
  syncUserDownComplete: "✅ {count} usuarios descargados exitosamente",
  syncUserUpComplete: "✅ {count} cambios de usuarios sincronizados",
  syncUserDownError: "❌ Error al descargar usuarios",
  syncUserUpError: "❌ Error al subir usuarios",
  noUserDataFound: "ℹ️ No hay datos de usuarios en el spreadsheet",
  noPendingUserChanges: "ℹ️ No hay cambios de usuarios pendientes",

  // Asset sync status messages
  syncingAssetDown: "Descargando datos de activos desde Google Spreadsheet...",
  syncingAssetUp: "Subiendo cambios de activos a Google Spreadsheet...",
  syncAssetDownComplete: "✅ {count} activos descargados exitosamente",
  syncAssetUpComplete: "✅ {count} cambios de activos sincronizados",
  syncAssetDownError: "❌ Error al descargar activos",
  syncAssetUpError: "❌ Error al subir activos",
  noAssetDataFound: "ℹ️ No hay datos de activos en el spreadsheet",
  noPendingAssetChanges: "ℹ️ No hay cambios de activos pendientes",

  // Loan sync status messages
  syncingLoanDown: "Descargando datos de préstamos desde Google Spreadsheet...",
  syncingLoanUp: "Subiendo cambios de préstamos a Google Spreadsheet...",
  syncLoanDownComplete: "✅ {count} préstamos descargados exitosamente",
  syncLoanUpComplete: "✅ {count} cambios de préstamos sincronizados",
  syncLoanDownError: "❌ Error al descargar préstamos",
  syncLoanUpError: "❌ Error al subir préstamos",
  noLoanDataFound: "ℹ️ No hay datos de préstamos en el spreadsheet",
  noPendingLoanChanges: "ℹ️ No hay cambios de préstamos pendientes",

  // Clear changes messages
  clearUserChangesTitle: "Limpiar Historial de Cambios de Usuarios",
  clearUserChangesDescription:
    "Elimina todos los cambios pendientes de usuarios del almacenamiento local.",
  clearUserChangesButton: "🗑️ Limpiar Historial de Cambios de Usuarios",

  clearAssetChangesTitle: "Limpiar Historial de Cambios de Activos",
  clearAssetChangesDescription:
    "Elimina todos los cambios pendientes de activos del almacenamiento local.",
  clearAssetChangesButton: "🗑️ Limpiar Historial de Cambios de Activos",

  clearLoanChangesTitle: "Limpiar Historial de Cambios de Préstamos",
  clearLoanChangesDescription:
    "Elimina todos los cambios pendientes de préstamos del almacenamiento local.",
  clearLoanChangesButton: "🗑️ Limpiar Historial de Cambios de Préstamos",

  clearUserChangesComplete: "✅ Historial de usuarios limpiado",
  clearAssetChangesComplete: "✅ Historial de activos limpiado",
  clearLoanChangesComplete: "✅ Historial de préstamos limpiado",
};
