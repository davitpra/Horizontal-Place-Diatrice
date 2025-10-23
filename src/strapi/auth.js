// Strapi Authentication utilities
import Cookies from 'js-cookie';

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337';

// Auth API endpoints
export const authEndpoints = {
  login: '/api/auth/local',
  register: '/api/auth/local/register',
  me: '/api/users/me',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
  changePassword: '/api/auth/change-password'
};

/**
 * Login user with email/password
 * @param {string} identifier - Email or username
 * @param {string} password - User password
 * @returns {Promise<{user: Object, jwt: string}>}
 */
export const login = async (identifier, password) => {
  try {
    const response = await fetch(`${STRAPI_HOST}${authEndpoints.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    // Store JWT in cookie
    if (data.jwt) {
      Cookies.set('jwt', data.jwt, { expires: 7, secure: true, sameSite: 'strict' });
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} password - User password
 * @returns {Promise<{user: Object, jwt: string}>}
 */
export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${STRAPI_HOST}${authEndpoints.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Registration failed');
    }

    // Store JWT in cookie
    if (data.jwt) {
      Cookies.set('jwt', data.jwt, { expires: 7, secure: true, sameSite: 'strict' });
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Get current user info
 * @returns {Promise<Object>}
 */
export const getMe = async () => {
  try {
    const token = Cookies.get('jwt');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${STRAPI_HOST}${authEndpoints.me}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get user info');
    }

    return data;
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  Cookies.remove('jwt');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!Cookies.get('jwt');
};

/**
 * Get JWT token
 * @returns {string|null}
 */
export const getToken = () => {
  return Cookies.get('jwt') || null;
};

/**
 * Forgot password
 * @param {string} email - User email
 * @returns {Promise<Object>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${STRAPI_HOST}${authEndpoints.forgotPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send reset email');
    }

    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password
 * @param {string} code - Reset code
 * @param {string} password - New password
 * @param {string} passwordConfirmation - Password confirmation
 * @returns {Promise<Object>}
 */
export const resetPassword = async (code, password, passwordConfirmation) => {
  try {
    const response = await fetch(`${STRAPI_HOST}${authEndpoints.resetPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        password,
        passwordConfirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Password reset failed');
    }

    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};
