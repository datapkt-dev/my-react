import { useEffect, useState } from 'react'
import { fetchReportList } from '../api/userApi'
import type { Report } from '../types/user'
import PageContainer from '../../../shared/components/layout/PageContainer'
import PageHeader from '../../../shared/components/layout/PageHeader'
import DataTable from '../../../shared/components/data-display/DataTable'
import type { ColumnDef } from '../../../shared/components/data-display/DataTable'
import ReportDetailModal from '../components/ReportDetailModal'

// ==========================================
// Types & Interfaces
// ==========================================

interface ReportRow {
  id: number
  reporterName: string
  reporterId: number
  reportType: string
  targetId: number
  reason: string
  status: string
  timeAdded: string
  avatar_url?: string
}

// ==========================================
// Column Definitions
// ==========================================

const REPORT_COLUMNS: ColumnDef<ReportRow>[] = [
  { key: 'reporterName', label: '檢舉人' },
  { key: 'reportType', label: '檢舉類型' },
  { key: 'targetId', label: '被檢舉對象' },
  { key: 'reason', label: '原因', truncate: true },
  {
    key: 'status',
    label: '狀態',
    render: (item) => (
      <span className={`font-medium ${statusColor(item.status)}`}>
        {statusLabel(item.status)}
      </span>
    ),
  },
  {
    key: 'timeAdded',
    label: '檢舉時間',
    render: (item) => <>{formatDate(item.timeAdded)}</>,
  },
];

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const statusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return '待處理';
    case 'resolved': return '已處理';
    case 'rejected': return '已駁回';
    default: return status;
  }
};

const statusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'text-status-pending';
    case 'resolved': return 'text-status-resolved';
    case 'rejected': return 'text-text-muted';
    default: return 'text-text-medium';
  }
};

// ==========================================
// Main Page Component
// ==========================================

const ReportListPage: React.FC = () => {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalReportId, setModalReportId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleOpenModal = (reportId: number) => {
    setModalReportId(reportId);
    setIsModalOpen(true);
  };

  const refreshReports = () => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    setLoading(true);
    fetchReportList(projectId)
      .then((res) => {
        const mapped: ReportRow[] = res.data.items.map((r: Report) => ({
          id: r.id,
          reporterName: r.reporter?.name ?? '--',
          reporterId: r.reporter_id,
          reportType: r.report_type,
          targetId: r.target_id,
          reason: r.reason,
          status: r.status,
          timeAdded: r.time_added,
          avatar_url: r.reporter?.avatar_url,
        }));
        setReports(mapped);
        setTotal(res.data.total);
        setFilteredReports(applySearch(mapped, searchKeyword));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  };

  const applySearch = (list: ReportRow[], keyword: string): ReportRow[] => {
    if (!keyword.trim()) return list;
    const lc = keyword.toLowerCase();
    return list.filter((r) =>
      r.reporterName?.toLowerCase().includes(lc) ||
      r.reportType?.toLowerCase().includes(lc) ||
      r.reason?.toLowerCase().includes(lc) ||
      r.status?.toLowerCase().includes(lc)
    );
  };

  useEffect(() => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    if (!projectId) {
      setError('無法取得專案 ID，請重新登入');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchReportList(projectId)
      .then((res) => {
        const mapped: ReportRow[] = res.data.items.map((r: Report) => ({
          id: r.id,
          reporterName: r.reporter?.name ?? '--',
          reporterId: r.reporter_id,
          reportType: r.report_type,
          targetId: r.target_id,
          reason: r.reason,
          status: r.status,
          timeAdded: r.time_added,
          avatar_url: r.reporter?.avatar_url,
        }));
        setReports(mapped);
        setTotal(res.data.total);
        setFilteredReports(mapped);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFilteredReports(applySearch(reports, searchKeyword));
    setCurrentPage(1);
  }, [searchKeyword, reports]);

  return (
    <PageContainer>
      <PageHeader
        title="檢舉清單"
        count={total}
        actions={
          <input
            type="text"
            placeholder="搜尋檢舉人、類型、原因..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="h-10 px-3 border border-border rounded text-sm w-[260px] outline-none focus:border-primary"
          />
        }
      />

      <DataTable<ReportRow>
        data={filteredReports}
        columns={REPORT_COLUMNS}
        rowKey={(item) => item.id}
        layout="fill"
        actions={[
          { label: '查看', onClick: (item) => handleOpenModal(item.id) },
        ]}
        pagination={{
          currentPage,
          pageSize,
          totalItems: filteredReports.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: (size) => { setPageSize(size); setCurrentPage(1); },
        }}
        loading={loading}
        error={error}
        emptyText="暫無檢舉資料"
      />

      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportId={modalReportId}
        onConfirm={refreshReports}
      />
    </PageContainer>
  );
};

export default ReportListPage;
