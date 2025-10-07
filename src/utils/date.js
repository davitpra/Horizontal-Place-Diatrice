// Date utilities: getMonday/getSunday for a given date input (Date or ISO string)

/**
 * Normalize input into a Date instance (UTC-safe for date-only strings)
 * Accepts a Date or an ISO date string like "YYYY-MM-DD".
 */
const toDate = (input) => {
    if (input instanceof Date) return new Date(input.getTime());
    if (typeof input === "string") return new Date(input);
    throw new Error("Invalid date input. Expected Date or ISO string.");
};

/**
 * Format a Date as YYYY-MM-DD using UTC to avoid timezone shifts
 */
const formatYYYYMMDD = (d) => {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Get the Monday of the week for the given date (ISO week, Monday start)
 */
export const getMonday = (input) => {
    const d = toDate(input);
    // Convert JS Sunday=0..Saturday=6 to Monday=0..Sunday=6
    const weekdayFromMonday = (d.getUTCDay() + 6) % 7;
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - weekdayFromMonday));
    return formatYYYYMMDD(monday);
};

/**
 * Get the Sunday of the week for the given date (Monday start week)
 */
export const getSunday = (input) => {
    const d = toDate(input);
    const weekdayFromMonday = (d.getUTCDay() + 6) % 7;
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - weekdayFromMonday));
    const sunday = new Date(monday.getTime());
    sunday.setUTCDate(monday.getUTCDate() + 6);
    return formatYYYYMMDD(sunday);
};


