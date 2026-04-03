import React, { useCallback, useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import type { ColumnDef } from '../components/DataTable';
import NotificationDetailModal from '../components/NotificationDetailModal';
import type { NotificationDetail } from '../components/NotificationDetailModal';
import { getNotifications } from '../api/notificationApi';
import type { NotificationItem } from '../api/notificationApi';

// ==========================================
// Helpers
// ==========================================

/** 時間格式化：2025-06-01T10:30:00 → 2025-06-01 10:30 */
const formatTime = (raw?: string): string => {
  if (!raw) return '--';
  const d = new Date(raw);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// ==========================================
// Table Columns（仿 Vue nexly-web list.vue）
// ==========================================

const COLUMNS: ColumnDef<NotificationItem>[] = [
  { key: 'title', label: '標題', width: 'w-48' },
  {
    key: 'time_added',
    label: '時間',
    width: 'w-44',
    render: (item) => <>{formatTime(item.time_added)}</>,
  },
  {
    key: 'target',
    label: '發佈對象',
    width: 'w-28',
    render: () => <>全部</>,
  },
  {
    key: 'content',
    label: '發佈內容',
    render: (item) => (
      <span className="line-clamp-1">{item.content || '--'}</span>
    ),
  },
];

// ==========================================
// Page Component
// ==========================================

const NotificationManagement: React.FC = () => {
  // --- 列表狀態 ---
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- 彈窗狀態 ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view'>('create');
  const [modalData, setModalData] = useState<NotificationDetail | null>(null);

  // --- 載入資料 ---
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications({ page: currentPage, page_size: pageSize });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- 新增推播 ---
  const handleAdd = () => {
    setModalMode('create');
    setModalData(null);
    setModalOpen(true);
  };

  // --- 查看推播（點擊列） ---
  const handleRowClick = (item: NotificationItem) => {
    setModalMode('view');
    setModalData({
      id: item.id,
      title: item.title,
      content: item.content,
      time_added: item.time_added,
    });
    setModalOpen(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title="歷史發佈通知"
        count={total}
        actionButtons={[
          { label: '新增發佈', onClick: handleAdd },
        ]}
      />

      {/* 通知列表 */}
      <DataTable<NotificationItem>
        data={items}
        columns={COLUMNS}
        rowKey={(item) => item.id}
        actions={[
          { label: '查看', onClick: handleRowClick },
        ]}
        pagination={{
          currentPage,
          pageSize,
          totalItems: total,
          pageSizeOptions: [10, 25, 50, 100],
          onPageChange: setCurrentPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
        loading={loading}
        error={error}
        emptyText="尚無通知"
      />

      {/* 新增 / 查看 彈窗 */}
      <NotificationDetailModal
        isOpen={modalOpen}
        mode={modalMode}
        data={modalData}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setCurrentPage(1);
          loadData();
        }}
      />
    </PageContainer>
  );
};

export default NotificationManagement;
