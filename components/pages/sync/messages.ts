/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export const messages = {
  title: "Sincronización de Datos",
  description:
    "Sincroniza los datos de usuarios entre el almacenamiento local y Google Spreadsheets.",

  syncDownTitle: "Descargar desde Spreadsheet",
  syncDownDescription:
    "Descarga los datos de usuarios desde Google Spreadsheet y los guarda en el almacenamiento local.",
  syncDownButton: "⬇️ Sincronizar Hacia Abajo",

  syncUpTitle: "Subir al Spreadsheet",
  syncUpDescription:
    "Sube los cambios pendientes de usuarios locales a Google Spreadsheet y reemplaza todos los datos existentes en el spreadsheet.",
  syncUpButton: "⬆️ Sincronizar Hacia Arriba",

  syncing: "Sincronizando...",
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
