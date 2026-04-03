import React, { useState, useRef, useEffect } from 'react';

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
  /**
   * 欄位佈局模式：
   * - 'scroll'（預設）：每欄固定寬度，超出容器時底部出現水平捲動條；actions 欄 sticky 固定在右側
   * - 'fill'：justify-between，欄位自動分散填滿容器寬度，不出現水平捲動
   */
  layout?: 'scroll' | 'fill';
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
          className={`px-2.5 w-[180px] h-10 flex items-center cursor-pointer text-sm hover:bg-bg-zebra ${
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
    <div className="w-[3px] h-[3px] bg-icon-dark rounded-full" />
    <div className="w-[3px] h-[3px] bg-icon-dark rounded-full" />
    <div className="w-[3px] h-[3px] bg-icon-dark rounded-full" />
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

// ==========================================
// Nexly-style Pagination Footer helpers
// ==========================================

/** 產生分頁頁碼陣列（含省略號） */
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

/** Nexly-style 分頁按鈕（含 hover 效果） */
const NexlyPageButton: React.FC<{
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  borderRadius?: string;
}> = ({ disabled = false, active = false, onClick, children, borderRadius }) => {
  const baseColor = disabled
    ? { bg: 'var(--color-disabled-bg)', fg: 'var(--color-text-muted)' }
    : active
      ? { bg: 'var(--color-primary)', fg: 'var(--color-white)' }
      : { bg: 'var(--color-white)', fg: 'var(--color-primary)' };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-center border-none cursor-pointer disabled:cursor-not-allowed transition-colors text-sm"
      style={{
        minWidth: '32px',
        height: '34px',
        padding: '0 8px',
        backgroundColor: baseColor.bg,
        color: baseColor.fg,
        ...(borderRadius ? { borderRadius } : {}),
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          e.currentTarget.style.color = 'var(--color-white)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.backgroundColor = baseColor.bg;
          e.currentTarget.style.color = baseColor.fg;
        }
      }}
    >
      {children}
    </button>
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
  layout = 'scroll',
}: DataTableProps<T>) {
  const [openMenuKey, setOpenMenuKey] = useState<string | number | null>(null);

  const hasActions = actions && actions.length > 0;

  // 分頁計算
  const currentPage = pagination?.currentPage ?? 1;
  const pSize = pagination?.pageSize ?? 10;
  const totalItems = pagination?.totalItems ?? data.length;
  const maxPage = Math.max(1, Math.ceil(totalItems / pSize));
  const isFirstPage = currentPage === 1 || data.length === 0;
  const isLastPage = currentPage >= maxPage || data.length === 0;
  const pageSizeOptions = pagination?.pageSizeOptions ?? [10, 25, 50, 100];

  // 分頁資料切片
  const displayData = pagination
    ? data.slice(
        (currentPage - 1) * pSize,
        currentPage * pSize,
      )
    : data;

  // 顯示筆數資訊
  const firstIndex = data.length === 0 ? 0 : (currentPage - 1) * pSize + 1;
  const lastIndex = Math.min(currentPage * pSize, totalItems);

  // 頁碼陣列
  const pageNumbers = getPageNumbers(currentPage, maxPage);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded overflow-hidden"
      style={{ boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.08)' }}>
      {/* ===== 表格主體區域 — flex-1 + 內部捲動 ===== */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className={layout === 'scroll' ? (minWidth ?? '') : ''}>
          {/* 表頭 */}
          <div className={`flex items-center px-2.5 h-[52px] bg-white border-b border-border sticky top-0 z-10${layout === 'fill' ? ' justify-between' : ''}`}>
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
              layout === 'scroll' ? (
                <div className="sticky right-0 w-[50px] px-2.5 text-text-muted text-sm tracking-wide text-center shrink-0 bg-white border-b border-border h-[52px] flex items-center justify-center z-20">
                  操作
                </div>
              ) : (
                <div className="w-[50px] px-2.5 text-text-muted text-sm tracking-wide text-center shrink-0">
                  操作
                </div>
              )
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
                    className={`flex items-center px-2.5 h-14 hover:bg-hover-row ${layout === 'fill' ? 'justify-between' : ''} ${
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
                      layout === 'scroll' ? (
                        <div
                          className={`sticky right-0 w-[50px] px-2.5 flex justify-center items-center relative shrink-0 h-14 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-bg-zebra'
                          }`}
                          style={{ zIndex: 1 }}
                        >
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
                      ) : (
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
                      )
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ===== Nexly-style 底部分頁 — 固定在表格底部，帶上方陰影 ===== */}
      {pagination && !loading && !error && data.length > 0 && (
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '12px 20px',
            boxShadow: '0px -1px 4px 0px rgba(0,0,0,0.13)',
          }}
        >
          {/* 左側：showing X to Y of Z items */}
          <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            showing {firstIndex} to {lastIndex} of {totalItems} items
          </div>

          {/* 右側：分頁按鈕 + 每頁筆數 */}
          <div className="flex items-center gap-2.5">
            {/* 分頁按鈕群組 */}
            <div className="flex">
              {/* 第一頁 */}
              <NexlyPageButton
                disabled={isFirstPage}
                onClick={() => pagination.onPageChange(1)}
                borderRadius="4px 0 0 4px"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7" />
                  <polyline points="18 17 13 12 18 7" />
                </svg>
              </NexlyPageButton>

              {/* 上一頁 */}
              <NexlyPageButton
                disabled={isFirstPage}
                onClick={() => pagination.onPageChange(currentPage - 1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </NexlyPageButton>

              {/* 頁碼按鈕 */}
              {pageNumbers.map((p, idx) =>
                p === '...' ? (
                  <div
                    key={`ellipsis-${idx}`}
                    className="flex items-center justify-center text-sm"
                    style={{ minWidth: '32px', height: '34px', color: 'var(--color-primary)' }}
                  >
                    ...
                  </div>
                ) : (
                  <NexlyPageButton
                    key={p}
                    active={p === currentPage}
                    onClick={() => pagination.onPageChange(p)}
                  >
                    {p}
                  </NexlyPageButton>
                ),
              )}

              {/* 下一頁 */}
              <NexlyPageButton
                disabled={isLastPage}
                onClick={() => pagination.onPageChange(currentPage + 1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </NexlyPageButton>

              {/* 最後一頁 */}
              <NexlyPageButton
                disabled={isLastPage}
                onClick={() => pagination.onPageChange(maxPage)}
                borderRadius="0 4px 4px 0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7" />
                  <polyline points="6 17 11 12 6 7" />
                </svg>
              </NexlyPageButton>
            </div>

            {/* 每頁筆數選擇器 */}
            {pagination.onPageSizeChange && (
              <div
                className="flex items-center"
                style={{
                  height: '34px',
                  background: 'var(--color-table-header-bg)',
                  padding: '0 8px',
                  boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.05) inset',
                }}
              >
                <select
                  value={pSize}
                  onChange={(e) => {
                    pagination.onPageSizeChange!(Number(e.target.value));
                    pagination.onPageChange(1);
                  }}
                  className="border-none bg-transparent text-sm font-medium cursor-pointer outline-none"
                  style={{ color: 'var(--color-text-heading)', padding: '0 8px' }}
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
