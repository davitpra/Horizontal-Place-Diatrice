/**
 * Configuración de sincronización
 * Ajusta estos valores según tus necesidades
 */

export const SYNC_CONFIG = {
  // Intervalo de sincronización para residents (en milisegundos)
  // Cambian poco, sincronización más lenta
  RESIDENTS_INTERVAL: 60000, // 1 minuto

  // Intervalo de sincronización para weekly menu (en milisegundos)
  // Cambia muy poco, sincronización más lenta
  WEEKLY_MENU_INTERVAL: 120000, // 2 minutos

  // Intervalo de sincronización para meals (en milisegundos)
  // Cambian frecuentemente durante el servicio, sincronización más rápida
  BREAKFAST_INTERVAL: 15000, // 15 segundos
  LUNCH_INTERVAL: 15000, // 15 segundos
  SUPPER_INTERVAL: 15000, // 15 segundos

  // Pausar sincronización cuando la pestaña está inactiva
  PAUSE_ON_INACTIVE: true,

  // Mostrar notificaciones toast por defecto
  SHOW_NOTIFICATIONS: true,

  // Habilitar sincronización automática por defecto
  ENABLED_BY_DEFAULT: true,

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
  SYNC_DISABLED: 'Auto-sync disabled',
  SYNC_ENABLED: 'Auto-sync enabled',
  SYNCING: 'Syncing data...',
};

