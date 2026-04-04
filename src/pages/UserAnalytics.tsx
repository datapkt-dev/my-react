import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../shared/components/layout/PageContainer';
import PageHeader from '../shared/components/layout/PageHeader';
import DataTable from '../shared/components/data-display/DataTable';
import type { ColumnDef } from '../shared/components/data-display/DataTable';
import { fetchUserAnalytics } from '../api/userApi';
import type { UserAnalytics, SortableField, SortState } from '../types/userAnalytics';

// ==========================================
// Column Definitions
// ==========================================

const USER_ANALYTICS_COLUMNS: ColumnDef<UserAnalytics>[] = [
  { key: 'account', label: '會員帳號', width: 'w-[350px]', truncate: true },
  { key: 'displayName', label: '用戶名稱', width: 'w-[180px]' },
  { key: 'postCount', label: '貼文數', sortable: true, width: 'w-[90px]' },
  { key: 'commentCount', label: '留言數', sortable: true, width: 'w-[90px]' },
  { key: 'likeCount', label: '按讚數', sortable: true, width: 'w-[90px]' },
  { key: 'reportCount', label: '檢舉數', sortable: true, width: 'w-[90px]' },
  { key: 'reportedPostCount', label: '被檢舉貼文數', sortable: true, width: 'w-[150px]' },
  { key: 'bookmarkCount', label: '收藏數', sortable: true, width: 'w-[90px]' },
];

// ==========================================
// Page Component
// ==========================================

const UserAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<UserAnalytics[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortState, setSortState] = useState<SortState>({ field: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    setLoading(true);
    fetchUserAnalytics(projectId)
      .then((res) => {
        const mapped: UserAnalytics[] = res.data.items.map((item) => ({
          id: String(item.user_id),
          account: item.account,
          displayName: item.name,
          postCount: item.tales_count,
          commentCount: item.comments_count,
          likeCount: item.likes_given_count,
          reportCount: item.reports_count,
          reportedPostCount: item.reported_tales_count,
          bookmarkCount: item.favorites_count,
        }));
        setData(mapped);
        setTotal(res.data.total);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  /** 處理排序切換：null → asc → desc → null */
  const handleSort = (field: SortableField) => {
    setSortState((prev) => {
      if (prev.field !== field) return { field, direction: 'asc' };
      if (prev.direction === 'asc') return { field, direction: 'desc' };
      if (prev.direction === 'desc') return { field: null, direction: null };
      return { field, direction: 'asc' };
    });
  };

  /** 排序後的資料 */
  const sortedData = useMemo(() => {
    if (!sortState.field || !sortState.direction) return data;

    const { field, direction } = sortState;
    return [...data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [sortState, data]);

  return (
    <PageContainer>
      <PageHeader
        title="用戶分析列表"
        count={total}
        dateRange="起迄日期：2025/08/01 ~ 2025/08/31"
        showFilter
        onFilterClick={() => console.log('open filter')}
      />
      <DataTable<UserAnalytics>
        data={sortedData}
        columns={USER_ANALYTICS_COLUMNS}
        rowKey={(item) => item.id}
        layout='fill'
        sort={{
          field: sortState.field,
          direction: sortState.direction,
          onSort: (field) => handleSort(field as SortableField),
        }}
        pagination={{
          currentPage,
          pageSize,
          totalItems: sortedData.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: (size) => { setPageSize(size); setCurrentPage(1); },
        }}
        loading={loading}
        error={error}
        minWidth="min-w-[900px]"
      />
    </PageContainer>
  );
};

export default UserAnalyticsPage;
