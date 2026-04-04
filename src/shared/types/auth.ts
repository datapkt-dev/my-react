// ==========================================
// Auth 相關型別定義
// ==========================================

/** 帳號驗證 API 回應 */
export interface ValidateResponse {
  data: {
    exists: boolean;
    need_verification: boolean;
  };
}

/** 登入成功 API 回應 */
export interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    staff: LoginStaff;
  };
}

/** 登入成功後回傳的員工資訊 */
export interface LoginStaff {
  avatar_url: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  staff_no: string;
}

/** 登入失敗 API 回應 */
export interface LoginErrorResponse {
  code: number;
  message: string;
}

/** 登入 API 請求 Body */
export interface LoginRequest {
  staff_no: string;
  password: string;
}

/** JWT Token 解碼後的 Payload */
export interface JwtPayload {
  admin: boolean;
  aud: string;
  customer_id: number;
  exp: number;
  iat: number;
  iss: string;
  roles: JwtRole[];
  typ: string;
}

export interface JwtRole {
  role_id: number;
  role_name: string;
  role_project_id: number;
}
