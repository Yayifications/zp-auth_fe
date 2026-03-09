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
    const normalizedDetails = backendError.details?.toLowerCase() || backendError.message?.toLowerCase() || '';
    if (
      normalizedDetails.includes('duplicate key value') ||
      normalizedDetails.includes('idx_users_email')
    ) {
      return 'Ya existe una cuenta con este correo electronico. Inicia sesion.';
    }
    
    // Handle validation errors with field details
    if (backendError.validation_errors && backendError.validation_errors.length > 0) {
      return backendError.validation_errors
        .map(err => `${err.field}: ${err.message}`)
        .join(', ');
    }
    
    // Handle specific error codes
    switch (backendError.code) {
      case 'UNAUTHORIZED':
        return backendError.message || 'Correo o contrasena invalida';
      case 'VALIDATION_ERROR':
        return backendError.message || 'Verifica la informacion ingresada';
      case 'CONFLICT':
        return backendError.message || 'Ya existe una cuenta con este correo electronico. Inicia sesion.';
      case 'NOT_FOUND':
        return backendError.message || 'Usuario no encontrado';
      case 'FORBIDDEN':
        return backendError.message || 'Acceso denegado';
      case 'INTERNAL_SERVER_ERROR':
        return 'Error del servidor. Intenta nuevamente mas tarde.';
      default:
        return backendError.message || 'Ocurrio un error. Intenta de nuevo.';
    }
  }
  
  // Handle network errors
  if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
    return 'No se puede conectar con el servidor. Verifica que el backend este activo.';
  }
  
  // Fallback error message
  return error.message || 'Ocurrio un error inesperado';
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

      const loginData = response.data?.data;
      if (!loginData) {
        throw new Error('Respuesta invalida del servidor');
      }

      if (!loginData.handoff_code) {
        throw new Error('No se recibio el codigo de handoff del servidor');
      }

      return loginData;
    } catch (error) {
      throw new Error(handleBackendError(error as AxiosError));
    }
  },

  async getActiveSession(): Promise<UnifiedLoginData | null> {
    try {
      const response = await api.get<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH_SESSION);
      const sessionData = response.data?.data;
      if (!sessionData?.handoff_code || !sessionData.redirect_url) {
        return null;
      }
      return sessionData;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401 || axiosError.response?.status === 404) {
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
    const { redirect_url: redirectUrl, handoff_code: handoffCode } = loginData;

    if (!redirectUrl) {
      throw new Error('Informacion de redireccion invalida desde el servidor');
    }

    if (!handoffCode) {
      throw new Error('No se encontro el codigo de handoff para completar el inicio de sesion');
    }

    const destination = redirectUrl.startsWith('http')
      ? new URL(redirectUrl)
      : new URL(redirectUrl, window.location.origin);

    destination.searchParams.set('handoff_code', handoffCode);

    window.location.href = destination.toString();
  },
};

// Export for use in components
export default authService;
