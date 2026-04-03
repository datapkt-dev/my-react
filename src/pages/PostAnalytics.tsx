import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { ColumnDef } from '../components/DataTable';
import { fetchPostAnalytics } from '../api/userApi';
import type { PostAnalytics, SortablePostField, PostSortState } from '../types/postAnalytics';

// ==========================================// Helpers
// ==========================================

function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ==========================================
// Column Definitions
// ==========================================

const POST_ANALYTICS_COLUMNS: ColumnDef<PostAnalytics>[] = [
  { key: 'account', label: '會員帳號', width: 'w-[350px]', truncate: true },
  { key: 'userName', label: '用戶名稱', width: 'w-[180px]' },
  { key: 'title', label: '貼文標題', width: 'w-[160px]', truncate: true },
  { key: 'content', label: '貼文內容', width: 'w-[200px]', truncate: true },
  { key: 'commentCount', label: '留言數', sortable: true, width: 'w-[80px]' },
  { key: 'replyCount', label: '回覆數', sortable: true, width: 'w-[80px]' },
  { key: 'likeCount', label: '按讚數', sortable: true, width: 'w-[80px]' },
  { key: 'reportCount', label: '檢舉數', sortable: true, width: 'w-[80px]' },
  { key: 'bookmarkCount', label: '收藏數', sortable: true, width: 'w-[80px]' },
  {
    key: 'timeAdded',
    label: '發佈時間',
    width: 'w-[160px]',
    render: (item) => <>{formatTime(item.timeAdded)}</>,
  },
];

// ==========================================// Page Component
// ==========================================

const PostAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<PostAnalytics[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortState, setSortState] = useState<PostSortState>({ field: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    setLoading(true);
    fetchPostAnalytics(projectId)
      .then((res) => {
        const mapped: PostAnalytics[] = res.data.items.map((item) => ({
          id: String(item.tale_id),
          account: item.account,
          userName: item.user_name,
          title: item.title,
          content: item.content,
          imageUrl: item.image_url,
          commentCount: item.comments_count,
          replyCount: item.replies_count,
          likeCount: item.likes_count,
          reportCount: item.reports_count,
          bookmarkCount: item.favorites_count,
          timeAdded: item.time_added,
        }));
        setData(mapped);
        setTotal(res.data.total);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  /** 處理排序切換：null → asc → desc → null */
  const handleSort = (field: SortablePostField) => {
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
        title="貼文分析列表"
        count={total}
        dateRange="起迄日期：2025/08/01 ~ 2025/08/31"
        showFilter
        onFilterClick={() => console.log('open filter')}
      />
      <DataTable<PostAnalytics>
        data={sortedData}
        columns={POST_ANALYTICS_COLUMNS}
        rowKey={(item) => item.id}
        actions={[
          { label: '查看', onClick: (item) => console.log('view', item.id) },
        ]}
        sort={{
          field: sortState.field,
          direction: sortState.direction,
          onSort: (field) => handleSort(field as SortablePostField),
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
        minWidth="min-w-[1500px]"
      />
    </PageContainer>
  );
};

export default PostAnalyticsPage;
