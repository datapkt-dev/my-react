export interface StaffRole {
  id: number;
  name: string;
  description: string;
  project_id: number;
  time_added: string;
  time_modified: string;
  project: {
    id: number;
    name: string;
    time_added: string;
    time_modified: string;
  };
}

export interface StaffProject {
  id: number;
  name: string;
  description: string;
  time_added: string;
  time_modified: string;
}

export interface Staff {
  id: number;
  staff_no: string;
  name: string;
  email: string;
  phone: string;
  time_added: string;
  time_modified: string;
  roles: StaffRole[];
  project: StaffProject;
}

export interface StaffListResponse {
  message: string;
  data: {
    items: Staff[];
    page: number;
    size: number;
    total: number;
  };
}
