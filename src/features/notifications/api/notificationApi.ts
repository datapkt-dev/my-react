// ==========================================
// 通知管理 API
// ==========================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const PROJECT_ID = 1;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ==========================================
// Types
// ==========================================

export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  time_added: string;
  target?: string;
}

export interface GetNotificationsResponse {
  data: {
    total: number;
    items: NotificationItem[];
  };
}

export interface AddNotificationPayload {
  creator: number;
  title: string;
  content: string;
}

// ==========================================
// API Functions
// ==========================================

/** 取得通知列表 */
export async function getNotifications(params: {
  page: number;
  page_size: number;
}): Promise<GetNotificationsResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.page_size),
  });

  const response = await fetch(
    `${BASE_URL}/api/v1/admin/projects/${PROJECT_ID}/notifications?${query}`,
    { headers: authHeaders() },
  );
  if (!response.ok) {
    throw new Error(`取得通知列表失敗: ${response.status}`);
  }
  return response.json();
}

/** 新增推播通知 */
export async function addNotification(
  payload: AddNotificationPayload,
): Promise<{ data: NotificationItem }> {
  const response = await fetch(
    `${BASE_URL}/api/v1/admin/projects/${PROJECT_ID}/notifications`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    throw new Error(`新增推播失敗: ${response.status}`);
  }
  return response.json();
}
