import type { StaffListResponse } from '../types/staff';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchStaffList(projectId: number): Promise<StaffListResponse> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/projects/${projectId}/staffs`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch staff list: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
