import React from 'react';
import type { PostAnalytics, SortablePostField, PostSortState } from '../../types/postAnalytics';

// ==========================================
// Types
// ==========================================

interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
  /** 固定寬度 */
  width?: string;
  /** 是否可截斷 */
  truncate?: boolean;
}

interface PostAnalyticsTableProps {
  data: PostAnalytics[];
  sortState: PostSortState;
  onSort: (field: SortablePostField) => void;
}

// ==========================================
// Column Definitions
// ==========================================

const COLUMNS: ColumnDef[] = [
  { key: 'account', label: '會員帳號', sortable: false, width: 'w-[180px]' },
  { key: 'userName', label: '用戶名稱', sortable: false, width: 'w-[130px]' },
  { key: 'title', label: '貼文標題', sortable: false, width: 'w-[160px]', truncate: true },
  { key: 'content', label: '貼文內容', sortable: false, width: 'w-[200px]', truncate: true },
  { key: 'commentCount', label: '留言數', sortable: true, width: 'w-[80px]' },
  { key: 'replyCount', label: '回覆數', sortable: true, width: 'w-[80px]' },
  { key: 'likeCount', label: '按讚數', sortable: true, width: 'w-[80px]' },
  { key: 'reportCount', label: '檢舉數', sortable: true, width: 'w-[80px]' },
  { key: 'bookmarkCount', label: '收藏數', sortable: true, width: 'w-[80px]' },
  { key: 'timeAdded', label: '發佈時間', sortable: false, width: 'w-[160px]' },
];

// ==========================================
// Helpers
// ==========================================

/** 格式化 ISO 時間為 YYYY/MM/DD HH:mm */
function formatTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ==========================================
// Sort Icon Component
// ==========================================

const SortIcon: React.FC<{ field: SortablePostField; sortState: PostSortState }> = ({ field, sortState }) => {
  const isActive = sortState.field === field;
  const direction = isActive ? sortState.direction : null;

  return (
    <span className="inline-flex flex-col items-center justify-center w-5 h-5 ml-1 cursor-pointer">
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        className={`mb-[1px] ${direction === 'asc' ? 'text-primary' : 'text-text-muted'}`}
        fill="currentColor"
      >
        <path d="M4 0L8 5H0L4 0Z" />
      </svg>
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

const TableHeader: React.FC<{ sortState: PostSortState; onSort: (field: SortablePostField) => void }> = ({
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
        onClick={() => col.sortable && onSort(col.key as SortablePostField)}
      >
        {col.label}
        {col.sortable && <SortIcon field={col.key as SortablePostField} sortState={sortState} />}
      </div>
    ))}
  </div>
);

// ==========================================
// Table Row Component
// ==========================================

const TableRow: React.FC<{ item: PostAnalytics; isZebra: boolean }> = ({ item, isZebra }) => (
  <div className={`flex items-center px-2.5 h-14 hover:bg-[#E0E0E0] ${isZebra ? 'bg-bg-zebra' : 'bg-white'}`}>
    {COLUMNS.map((col) => {
      const raw = item[col.key as keyof PostAnalytics];
      const display = col.key === 'timeAdded' ? formatTime(raw as string) : String(raw);
      return (
        <div
          key={col.key}
          className={`flex items-center px-2.5 text-sm text-text-medium tracking-wide shrink-0 ${
            col.width ?? 'w-[100px]'
          } ${col.truncate ? 'overflow-hidden' : ''}`}
        >
          <span className={col.truncate ? 'truncate' : ''}>{display}</span>
        </div>
      );
    })}
  </div>
);

// ==========================================
// Main Table Component
// ==========================================

const PostAnalyticsTable: React.FC<PostAnalyticsTableProps> = ({ data, sortState, onSort }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1300px]">
        <TableHeader sortState={sortState} onSort={onSort} />
        <div>
          {data.length === 0 ? (
            <div className="py-5 px-2.5 text-text-light text-sm tracking-wide">暫無貼文分析資料</div>
          ) : (
            data.map((item, idx) => (
              <TableRow key={item.id} item={item} isZebra={idx % 2 === 1} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAnalyticsTable;
