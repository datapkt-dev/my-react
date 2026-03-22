import type { UserListResponse, UserDetailListResponse } from '../types/user';

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
