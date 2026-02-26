import axios, { AxiosError } from 'axios';
import { API_CONFIG, LoginResponse, RegisterResponse, BackendError, UnifiedLoginData } from './api';

// Configure axios defaults
axios.defaults.timeout = 10000;

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
  async unifiedLogin(email: string, password: string): Promise<UnifiedLoginData> {
    try {
      const response = await api.post<LoginResponse>(API_CONFIG.ENDPOINTS.UNIFIED_LOGIN, {
        email,
        password,
      });
      if (!response.data?.data) {
        throw new Error('Invalid response from server');
      }

      return response.data.data;
    } catch (error) {
      throw new Error(handleBackendError(error as AxiosError));
    }
  },

  async getActiveSession(): Promise<UnifiedLoginData | null> {
    try {
      const response = await api.get<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH_SESSION);
      if (!response.data?.data) {
        return null;
      }
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        return null;
      }
      throw new Error(handleBackendError(axiosError));
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
      const birthdayISO = userData.birthday
        ? `${userData.birthday}T00:00:00Z`
        : undefined;

      const response = await api.post(API_CONFIG.ENDPOINTS.USER_REGISTER, {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Backend expects "password", not "password_hash"
        phone_number: userData.phone_number,
        birthday: birthdayISO,
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

  // Redirect to appropriate frontend using server-provided URL
  redirectToApp(loginData: UnifiedLoginData) {
    const { redirect_url: redirectUrl } = loginData;

    if (!redirectUrl) {
      throw new Error('Invalid redirect information from server');
    }

    const destination = redirectUrl.startsWith('http')
      ? new URL(redirectUrl)
      : new URL(redirectUrl, window.location.origin);
    window.location.href = destination.toString();
  },
};

// Export for use in components
export default authService;
