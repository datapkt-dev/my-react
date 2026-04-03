import React from 'react';
import type { UserAnalytics, SortableField, SortState } from '../../types/userAnalytics';

// ==========================================
// Types
// ==========================================

interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
  /** 固定寬度（對應 Figma FIXED） */
  width?: string;
}

interface UserAnalyticsTableProps {
  data: UserAnalytics[];
  sortState: SortState;
  onSort: (field: SortableField) => void;
}

// ==========================================
// Column Definitions
// ==========================================

const COLUMNS: ColumnDef[] = [
  { key: 'account', label: '會員帳號', sortable: false, width: 'w-[180px]' },
  { key: 'displayName', label: '用戶名稱', sortable: false, width: 'w-[140px]' },
  { key: 'postCount', label: '貼文數', sortable: true, width: 'w-[90px]' },
  { key: 'commentCount', label: '留言數', sortable: true, width: 'w-[90px]' },
  { key: 'likeCount', label: '按讚數', sortable: true, width: 'w-[90px]' },
  { key: 'reportCount', label: '檢舉數', sortable: true, width: 'w-[90px]' },
  { key: 'reportedPostCount', label: '被檢舉貼文數', sortable: true, width: 'w-[130px]' },
  { key: 'bookmarkCount', label: '收藏數', sortable: true, width: 'w-[90px]' },
];

// ==========================================
// Sort Icon Component
// ==========================================

const SortIcon: React.FC<{ field: SortableField; sortState: SortState }> = ({ field, sortState }) => {
  const isActive = sortState.field === field;
  const direction = isActive ? sortState.direction : null;

  return (
    <span className="inline-flex flex-col items-center justify-center w-5 h-5 ml-1 cursor-pointer">
      {/* 上箭頭 */}
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        className={`mb-[1px] ${direction === 'asc' ? 'text-primary' : 'text-text-muted'}`}
        fill="currentColor"
      >
        <path d="M4 0L8 5H0L4 0Z" />
      </svg>
      {/* 下箭頭 */}
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        className={`mt-[1px] ${direction === 'desc' ? 'text-primary' : 'text-text-muted'}`}
        fill="currentColor"
      >
        <path d="M4 5L0 0H8L4 5Z" />
      </svg>
    </span>
  );
};

// ==========================================
// Table Header Component
// ==========================================

const TableHeader: React.FC<{ sortState: SortState; onSort: (field: SortableField) => void }> = ({
  sortState,
  onSort,
}) => (
  <div className="flex items-center bg-white border-b border-border px-2.5 h-[52px]">
    {COLUMNS.map((col) => (
      <div
        key={col.key}
        className={`flex items-center px-2.5 text-sm text-text-muted tracking-wide whitespace-nowrap shrink-0 ${
          col.width ?? 'w-[100px]'
        } ${col.sortable ? 'cursor-pointer select-none hover:text-text-dark transition-colors' : ''}`}
        onClick={() => col.sortable && onSort(col.key as SortableField)}
      >
        {col.label}
        {col.sortable && <SortIcon field={col.key as SortableField} sortState={sortState} />}
      </div>
    ))}
  </div>
);

// ==========================================
// Table Row Component
// ==========================================

const TableRow: React.FC<{ item: UserAnalytics; isZebra: boolean }> = ({ item, isZebra }) => (
  <div className={`flex items-center px-2.5 h-14 hover:bg-hover-row ${isZebra ? 'bg-bg-zebra' : 'bg-white'}`}>
    {COLUMNS.map((col) => (
      <div
        key={col.key}
        className={`flex items-center px-2.5 text-sm text-text-medium tracking-wide shrink-0 ${col.width ?? 'w-[100px]'}`}
      >
        {String(item[col.key as keyof UserAnalytics])}
      </div>
    ))}
  </div>
);

// ==========================================
// Main Table Component
// ==========================================

const UserAnalyticsTable: React.FC<UserAnalyticsTableProps> = ({ data, sortState, onSort }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px]">
        <TableHeader sortState={sortState} onSort={onSort} />
        <div>
          {data.map((item, idx) => (
            <TableRow key={item.id} item={item} isZebra={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsTable;
