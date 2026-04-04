import React, { useState, useEffect } from 'react';
import { fetchStaffList, createStaff } from '../features/staffs/api/staffApi';
import type { CreateStaffPayload } from '../features/staffs/types/staff';
import AddStaffModal from '../features/staffs/components/AddStaffModal';
import PageContainer from '../shared/components/layout/PageContainer';
import PageHeader from '../shared/components/layout/PageHeader';
import DataTable from '../shared/components/data-display/DataTable';
import type { ColumnDef } from '../shared/components/data-display/DataTable';

// ==========================================
// Types & Interfaces
// ==========================================

interface AdminUser {
  numericId: number;
  id: string;
  name: string;
  phone: string;
  email: string;
}

// ==========================================
// Column Definitions
// ==========================================

const STAFF_COLUMNS: ColumnDef<AdminUser>[] = [
  { key: 'id', label: '帳號' },
  { key: 'name', label: '姓名' },
  { key: 'phone', label: '手機' },
  { key: 'email', label: '信箱' },
];

// ==========================================
// Main Page Component
// ==========================================

const Staffs: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadStaffs = () => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    if (!projectId) {
      setError('無法取得專案 ID，請重新登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchStaffList(projectId)
      .then((res) => {
        const mapped = res.data.items.map((s) => ({
          numericId: s.id,
          id: s.staff_no,
          name: s.name,
          phone: s.phone,
          email: s.email,
        }));
        setAdmins(mapped);
        setTotal(res.data.total);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStaffs();
  }, []);

  const handleAddStaff = async (data: CreateStaffPayload) => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createStaff(projectId, data);
      setIsAddModalOpen(false);
      loadStaffs();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : '新增失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="管理員列表"
        count={total}
        actionButtons={[
          { label: '新增', onClick: () => setIsAddModalOpen(true) },
        ]}
      />

      <DataTable<AdminUser>
        data={admins}
        columns={STAFF_COLUMNS}
        rowKey={(item) => item.numericId}
        layout="fill"
        actions={[
          { label: '查看', onClick: (item) => console.log('view', item.numericId) },
          { label: '編輯', onClick: (item) => console.log('edit', item.numericId) },
          { label: '刪除', onClick: (item) => console.log('delete', item.numericId), className: 'text-danger' },
        ]}
        pagination={{
          currentPage,
          pageSize,
          totalItems: admins.length,
          pageSizeOptions: [10, 25, 50, 100],
          onPageChange: setCurrentPage,
          onPageSizeChange: (size) => { setPageSize(size); setCurrentPage(1); },
        }}
        loading={loading}
        error={error}
      />

      <AddStaffModal
        isOpen={isAddModalOpen}
        loading={submitting}
        apiError={submitError}
        onClose={() => { setIsAddModalOpen(false); setSubmitError(null); }}
        onSubmit={handleAddStaff}
      />
    </PageContainer>
  );
};

export default Staffs;