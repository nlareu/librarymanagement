/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export const messages = {
  title: "Sincronización de Datos",
  description:
    "Sincroniza los datos de usuarios y activos entre el almacenamiento local y Google Spreadsheets.",

  // User sync messages
  userSyncDownTitle: "Descargar Usuarios desde Spreadsheet",
  userSyncDownDescription:
    "Descarga los datos de usuarios desde Google Spreadsheet y los guarda en el almacenamiento local.",
  userSyncDownButton: "⬇️ Sincronizar Usuarios Hacia Abajo",

  userSyncUpTitle: "Subir Usuarios al Spreadsheet",
  userSyncUpDescription:
    "Sube los cambios pendientes de usuarios locales a Google Spreadsheet.",
  userSyncUpButton: "⬆️ Sincronizar Usuarios Hacia Arriba",

  // Asset sync messages
  assetSyncDownTitle: "Descargar Activos desde Spreadsheet",
  assetSyncDownDescription:
    "Descarga los datos de activos desde Google Spreadsheet y los guarda en el almacenamiento local.",
  assetSyncDownButton: "⬇️ Sincronizar Activos Hacia Abajo",

  assetSyncUpTitle: "Subir Activos al Spreadsheet",
  assetSyncUpDescription:
    "Sube los cambios pendientes de activos locales a Google Spreadsheet.",
  assetSyncUpButton: "⬆️ Sincronizar Activos Hacia Arriba",

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

  // Clear changes messages
  clearUserChangesTitle: "Limpiar Historial de Cambios de Usuarios",
  clearUserChangesDescription:
    "Elimina todos los cambios pendientes de usuarios del almacenamiento local.",
  clearUserChangesButton: "🗑️ Limpiar Cambios de Usuarios",

  clearAssetChangesTitle: "Limpiar Historial de Cambios de Activos",
  clearAssetChangesDescription:
    "Elimina todos los cambios pendientes de activos del almacenamiento local.",
  clearAssetChangesButton: "🗑️ Limpiar Cambios de Activos",

  clearUserChangesComplete:
    "✅ Historial de cambios de usuarios limpiado exitosamente.",
  clearAssetChangesComplete:
    "✅ Historial de cambios de activos limpiado exitosamente.",

  // Legacy messages (for backward compatibility)
  syncDownTitle: "Descargar desde Spreadsheet",
  syncDownDescription:
    "Descarga los datos de usuarios desde Google Spreadsheet y los guarda en el almacenamiento local.",
  syncDownButton: "⬇️ Sincronizar Hacia Abajo",

  syncUpTitle: "Subir al Spreadsheet",
  syncUpDescription:
    "Sube los cambios pendientes de usuarios locales a Google Spreadsheet y reemplaza todos los datos existentes en el spreadsheet.",
  syncUpButton: "⬆️ Sincronizar Hacia Arriba",

  syncingDown: "Descargando y reemplazando datos desde Google Spreadsheet...",
  syncingUp: "Subiendo cambios pendientes a Google Spreadsheet...",

  syncDownComplete:
    "✅ Sincronización completada. {count} usuarios descargados y almacenados localmente.",
  syncUpComplete:
    "✅ Sincronización completada. {count} cambios subidos y aplicados en el spreadsheet.",

  syncDownError: "❌ Error al descargar datos",
  syncUpError: "❌ Error al subir datos",

  noDataFound: "ℹ️ No se encontraron datos en el spreadsheet.",
  noLocalData: "ℹ️ No hay datos locales para subir.",
  noPendingChanges: "ℹ️ No hay cambios pendientes para sincronizar.",
};
