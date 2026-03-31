import type { UserListResponse, UserDetailListResponse, ReportListResponse, ReportDetailResponse } from '../types/user';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchUserList(projectId: number): Promise<UserListResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/visitors`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user list: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchBannedUserList(projectId: number): Promise<UserListResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/visitors?is_banned=true`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch banned user list: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchReportList(projectId: number): Promise<ReportListResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/reports`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch report list: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchReportDetail(projectId: number, reportId: number): Promise<ReportDetailResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/reports/${reportId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch report detail: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function patchReportStatus(
  projectId: number,
  reportId: number,
  body: { status: 'resolved' | 'rejected'; admin_note: string }
): Promise<{ message: string }> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/reports/${reportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to patch report: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUserAnalytics(projectId: number): Promise<import('../types/userAnalytics').UserAnalyticsApiResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/visitors/analytics`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user analytics: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPostAnalytics(projectId: number): Promise<import('../types/postAnalytics').PostAnalyticsApiResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/tales/analytics`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch post analytics: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUserDetailList(projectId: number, userId: number): Promise<UserDetailListResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/visitors/${userId}/detail`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user list: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
