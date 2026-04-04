import type {
  ValidateResponse,
  LoginRequest,
  LoginResponse,
  LoginErrorResponse,
  JwtPayload,
} from '../types/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const AUTH_PATH = '/api/v1/admin/auth';

/**
 * 解析 JWT token 取得 project_id（從 roles[0].role_project_id）
 */
export function parseProjectIdFromToken(token: string): number | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload: JwtPayload = JSON.parse(atob(payloadBase64));
    return payload.roles?.[0]?.role_project_id ?? null;
  } catch {
    return null;
  }
}

/**
 * Step 1: 驗證帳號是否存在
 * GET /api/v1/admin/auth/validate?staff_no=xxx
 */
export async function validateAccount(staffNo: string): Promise<ValidateResponse> {
  const response = await fetch(
    `${BASE_URL}${AUTH_PATH}/validate?staff_no=${encodeURIComponent(staffNo)}`
  );
  if (!response.ok) {
    throw new Error('伺服器錯誤，請稍後再試');
  }
  return response.json();
}

/**
 * Step 2: 帳號密碼登入
 * POST /api/v1/admin/auth/login
 */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}${AUTH_PATH}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errData = data as LoginErrorResponse;
    throw new Error(errData.message || '登入失敗');
  }

  return data as LoginResponse;
}

/**
 * 登出：清除本地儲存的 token 及使用者資訊
 */
export function logout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('staff');
  localStorage.removeItem('project_id');
}
