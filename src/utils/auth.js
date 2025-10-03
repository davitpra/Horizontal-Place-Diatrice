// Authentication utilities
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

/**
 * Get user info from JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded user info or null
 */
export const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    if (!token) return true;
    
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get token from cookies
 * @returns {string|null} - JWT token or null
 */
export const getTokenFromCookies = () => {
  return Cookies.get('jwt') || null;
};

/**
 * Set token in cookies
 * @param {string} token - JWT token
 * @param {number} expiresInDays - Days until expiration (default: 7)
 */
export const setTokenInCookies = (token, expiresInDays = 7) => {
  Cookies.set('jwt', token, { 
    expires: expiresInDays, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  });
};

/**
 * Remove token from cookies
 */
export const removeTokenFromCookies = () => {
  Cookies.remove('jwt');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getTokenFromCookies();
  return !!(token && !isTokenExpired(token));
};

/**
 * Format user role for display
 * @param {Object} role - User role object
 * @returns {string} - Formatted role name
 */
export const formatUserRole = (role) => {
  if (!role) return 'Usuario';
  
  const roleMap = {
    'authenticated': 'Usuario',
    'admin': 'Administrador',
    'editor': 'Editor',
    'viewer': 'Visor'
  };
  
  return roleMap[role.name] || role.name || 'Usuario';
};

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string} roleName - Role name to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (user, roleName) => {
  if (!user || !user.role) return false;
  return user.role.name === roleName;
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  return hasRole(user, 'admin') || hasRole(user, 'admin');
};

/**
 * Check if user can edit content
 * @param {Object} user - User object
 * @returns {boolean} - True if user can edit
 */
export const canEdit = (user) => {
  return isAdmin(user) || hasRole(user, 'editor');
};

/**
 * Get user initials for avatar
 * @param {Object} user - User object
 * @returns {string} - User initials
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  if (user.username) {
    return user.username.charAt(0).toUpperCase();
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'La contraseña es requerida' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  
  return { isValid: true, message: '' };
};
