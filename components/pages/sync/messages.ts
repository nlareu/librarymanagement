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
  syncingUserDown:
    "Descargando y reemplazando datos de usuarios desde Google Spreadsheet...",
  syncingUserUp:
    "Subiendo cambios pendientes de usuarios a Google Spreadsheet...",
  syncUserDownComplete:
    "✅ Sincronización de usuarios completada. {count} usuarios descargados y almacenados localmente. Historial de cambios limpiado.",
  syncUserUpComplete:
    "✅ Sincronización de usuarios completada. {count} cambios subidos y aplicados en el spreadsheet. Historial de cambios limpiado.",
  syncUserDownError: "❌ Error al descargar datos de usuarios",
  syncUserUpError: "❌ Error al subir datos de usuarios",
  noUserDataFound: "ℹ️ No se encontraron datos de usuarios en el spreadsheet.",
  noPendingUserChanges:
    "ℹ️ No hay cambios pendientes de usuarios para sincronizar.",

  // Asset sync status messages
  syncingAssetDown:
    "Descargando y reemplazando datos de activos desde Google Spreadsheet...",
  syncingAssetUp:
    "Subiendo cambios pendientes de activos a Google Spreadsheet...",
  syncAssetDownComplete:
    "✅ Sincronización de activos completada. {count} activos descargados y almacenados localmente. Historial de cambios limpiado.",
  syncAssetUpComplete:
    "✅ Sincronización de activos completada. {count} cambios subidos y aplicados en el spreadsheet. Historial de cambios limpiado.",
  syncAssetDownError: "❌ Error al descargar datos de activos",
  syncAssetUpError: "❌ Error al subir datos de activos",
  noAssetDataFound: "ℹ️ No se encontraron datos de activos en el spreadsheet.",
  noPendingAssetChanges:
    "ℹ️ No hay cambios pendientes de activos para sincronizar.",

  // Loan sync status messages
  syncingLoanDown:
    "Descargando y reemplazando datos de préstamos desde Google Spreadsheet...",
  syncingLoanUp:
    "Subiendo cambios pendientes de préstamos a Google Spreadsheet...",
  syncLoanDownComplete:
    "✅ Sincronización de préstamos completada. {count} préstamos descargados y almacenados localmente. Historial de cambios limpiado.",
  syncLoanUpComplete:
    "✅ Sincronización de préstamos completada. {count} cambios subidos y aplicados en el spreadsheet. Historial de cambios limpiado.",
  syncLoanDownError: "❌ Error al descargar datos de préstamos",
  syncLoanUpError: "❌ Error al subir datos de préstamos",
  noLoanDataFound: "ℹ️ No se encontraron datos de préstamos en el spreadsheet.",
  noPendingLoanChanges:
    "ℹ️ No hay cambios pendientes de préstamos para sincronizar.",

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

  clearUserChangesComplete:
    "✅ Historial de cambios de usuarios limpiado exitosamente.",
  clearAssetChangesComplete:
    "✅ Historial de cambios de activos limpiado exitosamente.",
  clearLoanChangesComplete:
    "✅ Historial de cambios de préstamos limpiado exitosamente.",
};
