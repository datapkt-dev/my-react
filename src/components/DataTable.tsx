import React, { useState, useRef, useEffect } from 'react';
import Pagination from './Pagination';

// ==========================================
// Types
// ==========================================

/** 欄位定義 */
export interface ColumnDef<T> {
  /** 資料 key（對應 T 的欄位名） */
  key: string;
  /** 表頭文字 */
  label: string;
  /** 寬度 class，如 'w-40'、'w-[120px]'；不設則 flex-1 */
  width?: string;
  /** 是否截斷（加 truncate） */
  truncate?: boolean;
  /** 是否可排序 */
  sortable?: boolean;
  /** 自訂渲染（優先度最高） */
  render?: (item: T, index: number) => React.ReactNode;
}

/** 操作選單項目 */
export interface ActionMenuItem<T> {
  /** 選項文字 */
  label: string;
  /** 點擊回呼 */
  onClick: (item: T) => void;
  /** 文字顏色 class（預設 text-text-dark） */
  className?: string;
}

/** 排序設定 */
export interface SortConfig {
  /** 當前排序欄位 key */
  field: string | null;
  /** 排序方向 */
  direction: 'asc' | 'desc' | null;
  /** 排序切換回呼 */
  onSort: (field: string) => void;
}

/** 分頁設定 */
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/** DataTable Props */
export interface DataTableProps<T> {
  /** 資料陣列 */
  data: T[];
  /** 欄位定義 */
  columns: ColumnDef<T>[];
  /** 取得每筆資料的唯一 key */
  rowKey: (item: T) => string | number;
  /** 操作選單（⋯ 按鈕），不傳則不顯示 */
  actions?: ActionMenuItem<T>[];
  /** 排序設定，不傳則不啟用排序 */
  sort?: SortConfig;
  /** 分頁設定，不傳則不顯示分頁 */
  pagination?: PaginationConfig;
  /** 載入中 */
  loading?: boolean;
  /** 錯誤訊息 */
  error?: string | null;
  /** 空資料提示文字 */
  emptyText?: string;
  /** 最小寬度（水平捲動用），如 'min-w-[1300px]' */
  minWidth?: string;
}

// ==========================================
// Action Dropdown
// ==========================================

function ActionDropdown<T>({
  isOpen,
  onClose,
  item,
  actions,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: T;
  actions: ActionMenuItem<T>[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-9 bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[10px] z-[100] overflow-hidden"
    >
      {actions.map((action, i) => (
        <div
          key={i}
          onClick={() => {
            action.onClick(item);
            onClose();
          }}
          className={`px-2.5 w-[180px] h-10 flex items-center cursor-pointer text-sm hover:bg-[#F5F5F5] ${
            action.className ?? 'text-text-dark'
          }`}
        >
          {action.label}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Three-dot Menu Button
// ==========================================

const DotsButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    className="bg-transparent border-none cursor-pointer p-1 flex gap-[3px] items-center"
    onClick={onClick}
  >
    <div className="w-[3px] h-[3px] bg-[#28303F] rounded-full" />
    <div className="w-[3px] h-[3px] bg-[#28303F] rounded-full" />
    <div className="w-[3px] h-[3px] bg-[#28303F] rounded-full" />
  </button>
);

// ==========================================
// Sort Icon
// ==========================================

const SortIcon: React.FC<{ field: string; sort: SortConfig }> = ({ field, sort }) => {
  const isActive = sort.field === field;
  const direction = isActive ? sort.direction : null;

  return (
    <span className="inline-flex flex-col items-center justify-center w-5 h-5 ml-1">
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
// DataTable Component
// ==========================================

function DataTable<T>({
  data,
  columns,
  rowKey,
  actions,
  sort,
  pagination,
  loading = false,
  error = null,
  emptyText = '暫無資料',
  minWidth,
}: DataTableProps<T>) {
  const [openMenuKey, setOpenMenuKey] = useState<string | number | null>(null);

  const hasActions = actions && actions.length > 0;

  // 分頁資料切片
  const displayData = pagination
    ? data.slice(
        (pagination.currentPage - 1) * pagination.pageSize,
        pagination.currentPage * pagination.pageSize,
      )
    : data;

  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.pageSize)
    : 0;

  return (
    <>
      {/* 表格區塊 — flex-1 讓它佔滿剩餘空間 */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto min-h-0">
          <div className={minWidth ?? ''}>
            {/* 表頭 */}
            <div className="flex items-center px-2.5 h-[52px] bg-white border-b border-border sticky top-0 z-10">
              {columns.map((col) => {
                const widthClass = col.width
                  ? `${col.width} shrink-0`
                  : 'flex-1';
                return (
                  <div
                    key={col.key}
                    className={`flex items-center px-2.5 text-text-muted text-sm tracking-wide ${widthClass} ${
                      col.sortable && sort ? 'cursor-pointer select-none hover:text-text-dark transition-colors' : ''
                    }`}
                    onClick={() => col.sortable && sort?.onSort(col.key)}
                  >
                    {col.label}
                    {col.sortable && sort && <SortIcon field={col.key} sort={sort} />}
                  </div>
                );
              })}
              {hasActions && (
                <div className="w-[50px] px-2.5 text-text-muted text-sm tracking-wide text-center shrink-0">
                  操作
                </div>
              )}
            </div>

            {/* 內容列 */}
            <div className="flex flex-col">
              {loading && (
                <div className="py-5 px-2.5 text-text-light text-sm tracking-wide">載入中...</div>
              )}
              {!loading && error && (
                <div className="py-5 px-2.5 text-danger text-sm tracking-wide">{error}</div>
              )}
              {!loading && !error && displayData.length === 0 && (
                <div className="py-5 px-2.5 text-text-light text-sm tracking-wide">{emptyText}</div>
              )}
              {!loading &&
                !error &&
                displayData.map((item, index) => {
                  const key = rowKey(item);
                  return (
                    <div
                      key={key}
                      className={`flex items-center px-2.5 h-14 hover:bg-[#E0E0E0] ${
                        index % 2 === 0 ? 'bg-white' : 'bg-bg-zebra'
                      }`}
                    >
                      {columns.map((col) => {
                        const value = col.render
                          ? col.render(item, index)
                          : String((item as Record<string, unknown>)[col.key] ?? '--');
                        const widthClass = col.width
                          ? `${col.width} shrink-0`
                          : 'flex-1';
                        return (
                          <div
                            key={col.key}
                            className={`px-2.5 text-sm text-text-medium tracking-wide ${widthClass}`}
                          >
                            {value}
                          </div>
                        );
                      })}
                      {hasActions && (
                        <div className="w-[50px] px-2.5 flex justify-center relative shrink-0">
                          <DotsButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuKey((prev) => (prev === key ? null : key));
                            }}
                          />
                          <ActionDropdown
                            isOpen={openMenuKey === key}
                            onClose={() => setOpenMenuKey(null)}
                            item={item}
                            actions={actions!}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* 分頁 */}
      {pagination && !loading && !error && data.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          pageSize={pagination.pageSize}
          pageSizeOptions={pagination.pageSizeOptions}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </>
  );
}

export default DataTable;
