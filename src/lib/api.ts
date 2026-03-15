// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    UNIFIED_LOGIN: '/api/unified-login',
    USER_REGISTER: '/api/users',
    PARTNER_REGISTER: '/api/partners',
    AUTH_SESSION: '/api/auth/session/identity',
  },
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
export interface UnifiedLoginData {
  type: 'user' | 'partner';
  redirect_url?: string | null;
  handoff_code: string;
  message?: string;
  user?: UserSummary;
  partner?: PartnerSummary;
}

export type LoginResponse = BackendSuccessResponse<UnifiedLoginData>;

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
}

export interface PartnerSummary {
  id: number;
  name: string;
  email: string;
  approved: boolean;
}

export type RegisterResponse = BackendSuccessResponse<{
  user?: UserSummary;
  partner?: PartnerSummary;
}>;
