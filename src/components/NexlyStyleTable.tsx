import React, { useState, useRef, useEffect } from 'react';

// ==========================================
// Types
// ==========================================

/** 欄位定義 */
export interface NexlyColumnDef<T> {
  /** 資料 key（對應 T 的欄位名） */
  key: string;
  /** 表頭文字 */
  label: string;
  /** 固定寬度（px），不設則自動分配 */
  width?: number;
  /** 自訂渲染 */
  render?: (item: T, index: number) => React.ReactNode;
}

/** 操作選單項目 */
export interface NexlyActionMenuItem<T> {
  label: string;
  onClick: (item: T) => void;
  className?: string;
}

/** NexlyStyleTable Props */
export interface NexlyStyleTableProps<T> {
  /** 資料陣列（當前頁） */
  data: T[];
  /** 欄位定義 */
  columns: NexlyColumnDef<T>[];
  /** 取得每筆資料的唯一 key */
  rowKey: (item: T) => string | number;
  /** 操作選單 */
  actions?: NexlyActionMenuItem<T>[];
  /** 分頁 — 當前頁碼 (1-based) */
  page: number;
  /** 分頁 — 每頁筆數 */
  pageSize: number;
  /** 分頁 — 總筆數 */
  totalItems: number;
  /** 每頁筆數選項 */
  pageSizeOptions?: number[];
  /** 頁碼變更 */
  onPageChange: (page: number) => void;
  /** 每頁筆數變更 */
  onPageSizeChange: (size: number) => void;
  /** 載入中 */
  loading?: boolean;
  /** 空資料提示文字 */
  emptyText?: string;
  /** 表格區域高度偏移（從 100dvh 扣除的 px，預設 260） */
  heightOffset?: number;
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
  actions: NexlyActionMenuItem<T>[];
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
      className="absolute right-0 top-9 bg-white z-[100] overflow-hidden"
      style={{
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
        borderRadius: '10px',
      }}
    >
      {actions.map((action, i) => (
        <div
          key={i}
          onClick={() => { action.onClick(item); onClose(); }}
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
// NexlyStyleTable Component
// ==========================================

function NexlyStyleTable<T>({
  data,
  columns,
  rowKey,
  actions,
  page,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  loading = false,
  emptyText = '暫無資料',
  heightOffset = 260,
}: NexlyStyleTableProps<T>) {
  const [openMenuKey, setOpenMenuKey] = useState<string | number | null>(null);
  const tableBodyRef = useRef<HTMLDivElement>(null);

  const hasActions = actions && actions.length > 0;

  // 分頁計算
  const maxPage = Math.max(1, Math.ceil(totalItems / pageSize));
  const isFirstPage = page === 1 || data.length === 0;
  const isLastPage = page >= maxPage || data.length === 0;

  // 顯示資訊
  const firstIndex = data.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, totalItems);

  // 分頁按鈕
  const prevPage = () => { if (!isFirstPage) onPageChange(page - 1); };
  const nextPage = () => { if (!isLastPage) onPageChange(page + 1); };
  const goToPage = (p: number) => { onPageChange(p); };
  const goToFirstPage = () => { if (!isFirstPage) onPageChange(1); };
  const goToLastPage = () => { if (!isLastPage) onPageChange(maxPage); };

  // 產生分頁頁碼陣列（支援省略號）
  const getPageNumbers = (): (number | '...')[] => {
    if (maxPage <= 7) {
      return Array.from({ length: maxPage }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    const start = Math.max(2, page - 1);
    const end = Math.min(maxPage - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < maxPage - 2) pages.push('...');
    pages.push(maxPage);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 每頁筆數變更
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
    onPageChange(1); // 重置到第一頁
  };

  // 表格高度
  const tableHeight = `calc(100dvh - ${heightOffset}px)`;

  return (
    <div className="flex flex-col bg-white rounded overflow-hidden" style={{ boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.08)' }}>
      {/* ===== 表格主體區域 — 固定高度 + 內部捲動 ===== */}
      <div
        ref={tableBodyRef}
        className="overflow-auto"
        style={{
          minHeight: tableHeight,
          maxHeight: tableHeight,
        }}
      >
        <table className="w-full border-collapse" style={{ minWidth: '600px' }}>
          {/* 表頭 */}
          <thead className="sticky top-0 z-10 bg-white">
            <tr style={{ borderBottom: '1px solid #DEE2E6' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-sm font-normal text-text-muted whitespace-nowrap"
                  style={{
                    padding: '0 10px',
                    height: '40px',
                    ...(col.width ? { width: `${col.width}px`, minWidth: `${col.width}px` } : {}),
                  }}
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th
                  className="text-center text-sm font-normal text-text-muted"
                  style={{ width: '60px', minWidth: '60px', padding: '0 10px', height: '40px' }}
                >
                  操作
                </th>
              )}
            </tr>
          </thead>

          {/* 表身 */}
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center text-sm text-text-light py-10"
                >
                  載入中...
                </td>
              </tr>
            )}
            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="text-center text-sm text-text-light py-10"
                >
                  {emptyText}
                </td>
              </tr>
            )}
            {!loading &&
              data.map((item, index) => {
                const key = rowKey(item);
                return (
                  <tr
                    key={key}
                    className="hover:bg-[#E8EAEB] transition-colors"
                    style={{
                      backgroundColor: index % 2 === 0 ? 'transparent' : '#F8F9FA',
                      height: '48px',
                    }}
                  >
                    {columns.map((col) => {
                      const value = col.render
                        ? col.render(item, index)
                        : String((item as Record<string, unknown>)[col.key] ?? '--');
                      return (
                        <td
                          key={col.key}
                          className="text-sm text-text-medium whitespace-nowrap"
                          style={{ padding: '8px 10px' }}
                        >
                          {value}
                        </td>
                      );
                    })}
                    {hasActions && (
                      <td className="text-center relative" style={{ padding: '8px 10px' }}>
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
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ===== 底部分頁 — 固定在表格區域底部，不隨表格滾動 ===== */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{
          padding: '12px 20px',
          boxShadow: '0px -1px 4px 0px rgba(0,0,0,0.13)',
        }}
      >
        {/* 左側：顯示筆數資訊 */}
        <div className="text-sm font-medium" style={{ color: '#5F6E7B' }}>
          showing {firstIndex} to {lastIndex} of {totalItems} items
        </div>

        {/* 右側：分頁按鈕 + 每頁筆數 */}
        <div className="flex items-center gap-2.5">
          {/* 分頁按鈕群組 */}
          <div className="flex">
            {/* 第一頁 */}
            <button
              disabled={isFirstPage}
              onClick={goToFirstPage}
              className="flex items-center justify-center border-none cursor-pointer disabled:cursor-not-allowed transition-colors"
              style={{
                minWidth: '32px',
                height: '34px',
                padding: '0 8px',
                borderRadius: '4px 0 0 4px',
                backgroundColor: isFirstPage ? '#F0F0F0' : '#FFF',
                color: isFirstPage ? '#999' : 'var(--color-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isFirstPage) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#FFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isFirstPage) {
                  e.currentTarget.style.backgroundColor = '#FFF';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            </button>

            {/* 上一頁 */}
            <button
              disabled={isFirstPage}
              onClick={prevPage}
              className="flex items-center justify-center border-none cursor-pointer disabled:cursor-not-allowed transition-colors"
              style={{
                minWidth: '32px',
                height: '34px',
                padding: '0 8px',
                backgroundColor: isFirstPage ? '#F0F0F0' : '#FFF',
                color: isFirstPage ? '#999' : 'var(--color-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isFirstPage) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#FFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isFirstPage) {
                  e.currentTarget.style.backgroundColor = '#FFF';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

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
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className="flex items-center justify-center border-none cursor-pointer text-sm transition-colors"
                  style={{
                    minWidth: '32px',
                    height: '34px',
                    padding: '0 8px',
                    backgroundColor: p === page ? 'var(--color-primary)' : '#FFF',
                    color: p === page ? '#FFF' : 'var(--color-primary)',
                  }}
                  onMouseEnter={(e) => {
                    if (p !== page) {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                      e.currentTarget.style.color = '#FFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (p !== page) {
                      e.currentTarget.style.backgroundColor = '#FFF';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }
                  }}
                >
                  {p}
                </button>
              ),
            )}

            {/* 下一頁 */}
            <button
              disabled={isLastPage}
              onClick={nextPage}
              className="flex items-center justify-center border-none cursor-pointer disabled:cursor-not-allowed transition-colors"
              style={{
                minWidth: '32px',
                height: '34px',
                padding: '0 8px',
                backgroundColor: isLastPage ? '#F0F0F0' : '#FFF',
                color: isLastPage ? '#999' : 'var(--color-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isLastPage) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#FFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLastPage) {
                  e.currentTarget.style.backgroundColor = '#FFF';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* 最後一頁 */}
            <button
              disabled={isLastPage}
              onClick={goToLastPage}
              className="flex items-center justify-center border-none cursor-pointer disabled:cursor-not-allowed transition-colors"
              style={{
                minWidth: '32px',
                height: '34px',
                padding: '0 8px',
                borderRadius: '0 4px 4px 0',
                backgroundColor: isLastPage ? '#F0F0F0' : '#FFF',
                color: isLastPage ? '#999' : 'var(--color-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isLastPage) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#FFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLastPage) {
                  e.currentTarget.style.backgroundColor = '#FFF';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </button>
          </div>

          {/* 每頁筆數選擇器 */}
          <div
            className="flex items-center"
            style={{
              height: '34px',
              background: '#F8F9FA',
              padding: '0 8px',
              boxShadow: '1px 2px 4px 0px rgba(0,0,0,0.05) inset',
            }}
          >
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border-none bg-transparent text-sm font-medium cursor-pointer outline-none"
              style={{ color: '#2B2F35', padding: '0 8px' }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NexlyStyleTable;
