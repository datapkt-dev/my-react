import type { StaffListResponse } from '../types/staff';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchStaffList(): Promise<StaffListResponse> {
  const response = await fetch(`${BASE_URL}/api/staffs`);
  if (!response.ok) {
    throw new Error(`Failed to fetch staff list: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
