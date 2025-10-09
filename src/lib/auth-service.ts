import axios, { AxiosError } from 'axios';
import { API_CONFIG, LoginResponse, RegisterResponse, BackendError } from './api';

// Configure axios defaults
axios.defaults.timeout = 10000;

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler for backend responses
export const handleBackendError = (error: AxiosError): string => {
  if (error.response?.data) {
    const backendError = error.response.data as BackendError;
    
    // Handle validation errors with field details
    if (backendError.validation_errors && backendError.validation_errors.length > 0) {
      return backendError.validation_errors
        .map(err => `${err.field}: ${err.message}`)
        .join(', ');
    }
    
    // Handle specific error codes
    switch (backendError.code) {
      case 'UNAUTHORIZED':
        return backendError.message || 'Invalid email or password';
      case 'VALIDATION_ERROR':
        return backendError.message || 'Please check your input data';
      case 'CONFLICT':
        return backendError.message || 'This email is already registered';
      case 'NOT_FOUND':
        return backendError.message || 'User not found';
      case 'FORBIDDEN':
        return backendError.message || 'Access denied';
      case 'INTERNAL_SERVER_ERROR':
        return 'Server error. Please try again later.';
      default:
        return backendError.message || 'An error occurred. Please try again.';
    }
  }
  
  // Handle network errors
  if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
    return 'Cannot connect to server. Please check if the backend is running.';
  }
  
  // Fallback error message
  return error.message || 'An unexpected error occurred';
};

// Auth service
export const authService = {
  // Unified login (users and partners)
  async unifiedLogin(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.UNIFIED_LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleBackendError(error as AxiosError));
    }
  },

  // Register user
  async registerUser(userData: {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    birthday: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.USER_REGISTER, {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Backend expects "password", not "password_hash"
        phone_number: userData.phone_number,
        birthday: userData.birthday,
        auth_provider: 'local', // Default for our app
      });
      return response.data;
    } catch (error) {
      throw new Error(handleBackendError(error as AxiosError));
    }
  },

  // Register partner
  async registerPartner(partnerData: {
    name: string;
    contact_name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.PARTNER_REGISTER, {
        name: partnerData.name,
        contact_name: partnerData.contact_name,
        email: partnerData.email,
        password: partnerData.password, // Backend expects "password", not "password_hash"
        phone: partnerData.phone,
        address: partnerData.address,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleBackendError(error as AxiosError));
    }
  },

  // Store tokens in localStorage
  storeTokens(tokens: { token: string; refresh_token: string }) {
    localStorage.setItem('access_token', tokens.token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  },

  // Clear tokens
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Get stored tokens
  getTokens() {
    return {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
    };
  },

  // Redirect to appropriate frontend
  redirectToApp(type: 'user' | 'partner', tokens: { token: string; refresh_token: string }) {
    // Store tokens first
    this.storeTokens(tokens);
    
    // Create URL with tokens as query parameters for initial handoff
    const params = new URLSearchParams({
      token: tokens.token,
      refresh_token: tokens.refresh_token,
    });

    if (type === 'user') {
      window.location.href = `${API_CONFIG.REDIRECT_URLS.USERS_APP}?${params.toString()}`;
    } else {
      window.location.href = `${API_CONFIG.REDIRECT_URLS.PARTNERS_APP}?${params.toString()}`;
    }
  },
};

// Export for use in components
export default authService;
