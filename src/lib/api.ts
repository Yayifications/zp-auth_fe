// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    UNIFIED_LOGIN: '/api/unified-login',
    USER_REGISTER: '/api/users',
    PARTNER_REGISTER: '/api/partners',
    REFRESH_TOKEN: '/api/refresh-token',
  },
  REDIRECT_URLS: {
    USERS_APP: 'http://localhost:3002',
    PARTNERS_APP: 'http://localhost:3003',
  }
};

// Backend standardized error response structure
export interface BackendError {
  status: number;
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  path: string;
  validation_errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Backend standardized success response structure
export interface BackendSuccessResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}

// Response types from backend
export interface LoginResponse {
  message: string;
  type: 'user' | 'partner';
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  partner?: {
    id: number;
    name: string;
    email: string;
    approved: boolean;
  };
  token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  partner?: {
    id: number;
    name: string;
    email: string;
    approved: boolean;
  };
}
