/**
 * Configuración de sincronización
 * Sincronización manual únicamente - usar botón para sincronizar
 */

export const SYNC_CONFIG = {
  // Mostrar notificaciones toast por defecto
  SHOW_NOTIFICATIONS: true,

  // Tiempo de espera para reconexión (en milisegundos)
  RECONNECT_DELAY: 5000, // 5 segundos

  // Número máximo de reintentos de sincronización
  MAX_RETRIES: 3,

  // Tiempo de espera para peticiones HTTP (en milisegundos)
  REQUEST_TIMEOUT: 10000, // 10 segundos
};

/**
 * Configuración de notificaciones toast
 */
export const TOAST_CONFIG = {
  SUCCESS: {
    duration: 2000,
    icon: '🔄',
  },
  ERROR: {
    duration: 4000,
    icon: '❌',
  },
  INFO: {
    duration: 2000,
    icon: 'ℹ️',
  },
};

/**
 * Mensajes de sincronización
 */
export const SYNC_MESSAGES = {
  RESIDENTS_UPDATED: 'Residents data updated',
  WEEKLY_MENU_UPDATED: 'Weekly menu updated',
  MEALS_UPDATED: 'Meals synchronized', // Consolidated message for all meals
  SYNC_ERROR: 'Error syncing data',
  SYNCING: 'Syncing data...',
};

