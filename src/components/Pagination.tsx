import React, { useState, useRef, useEffect } from 'react';

// ==========================================
// Types
// ==========================================

interface PaginationProps {
  /** 當前頁碼（1-based） */
  currentPage: number;
  /** 總頁數 */
  totalPages: number;
  /** 每頁筆數 */
  pageSize: number;
  /** 每頁筆數選項 */
  pageSizeOptions?: number[];
  /** 頁碼變更 */
  onPageChange: (page: number) => void;
  /** 每頁筆數變更 */
  onPageSizeChange?: (size: number) => void;
}

// ==========================================
// Helpers
// ==========================================

/** 產生頁碼陣列（含省略號） */
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}

// ==========================================
// SVG Icons
// ==========================================

const FirstPageIcon: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 3V11" stroke={disabled ? '#CCC' : '#333'} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 2L5 7L11 12" stroke={disabled ? '#CCC' : '#333'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PrevPageIcon: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 2L4 7L9 12" stroke={disabled ? '#CCC' : '#333'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NextPageIcon: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5 2L10 7L5 12" stroke={disabled ? '#CCC' : '#333'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LastPageIcon: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M11 3V11" stroke={disabled ? '#CCC' : '#333'} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 2L9 7L3 12" stroke={disabled ? '#CCC' : '#333'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ==========================================
// Page Size Selector
// ==========================================

const PageSizeSelector: React.FC<{
  pageSize: number;
  options: number[];
  onChange: (size: number) => void;
}> = ({ pageSize, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative h-[30px]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-[30px] rounded bg-bg-gray flex items-center gap-1 px-2 border-none cursor-pointer text-sm text-text-dark"
      >
        <span className="leading-[16.8px]">{pageSize}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-0 bg-white rounded shadow-[0_0_10px_rgba(0,0,0,0.1)] z-10 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-[#F5F5F5] ${
                opt === pageSize ? 'text-primary font-medium' : 'text-text-dark'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// Pagination Component
// ==========================================

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalPages <= 0) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center justify-end py-1 gap-2.5 text-sm text-text-dark">
      {/* 頁碼區 */}
      <div className="h-[30px] rounded bg-bg-gray flex items-center">
        {/* 首頁 */}
        <button
          disabled={isFirst}
          onClick={() => onPageChange(1)}
          className={`w-[30px] h-[30px] flex items-center justify-center border-none bg-transparent ${
            isFirst ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#E8EAEB]'
          } rounded`}
        >
          <FirstPageIcon disabled={isFirst} />
        </button>

        {/* 上一頁 */}
        <button
          disabled={isFirst}
          onClick={() => onPageChange(currentPage - 1)}
          className={`w-[30px] h-[30px] flex items-center justify-center border-none bg-transparent ${
            isFirst ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#E8EAEB]'
          } rounded`}
        >
          <PrevPageIcon disabled={isFirst} />
        </button>

        {/* 頁碼按鈕 */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <div
              key={`ellipsis-${idx}`}
              className="w-[30px] h-[30px] flex items-center justify-center text-text-dark leading-[16.8px]"
            >
              ...
            </div>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-[30px] h-[30px] flex items-center justify-center border-none rounded leading-[16.8px] text-sm ${
                p === currentPage
                  ? 'bg-primary text-white cursor-default'
                  : 'bg-transparent text-text-dark cursor-pointer hover:bg-[#E8EAEB]'
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* 下一頁 */}
        <button
          disabled={isLast}
          onClick={() => onPageChange(currentPage + 1)}
          className={`w-[30px] h-[30px] flex items-center justify-center border-none bg-transparent ${
            isLast ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#E8EAEB]'
          } rounded`}
        >
          <NextPageIcon disabled={isLast} />
        </button>

        {/* 末頁 */}
        <button
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          className={`w-[30px] h-[30px] flex items-center justify-center border-none bg-transparent ${
            isLast ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#E8EAEB]'
          } rounded`}
        >
          <LastPageIcon disabled={isLast} />
        </button>
      </div>

      {/* 每頁筆數選擇器 */}
      {onPageSizeChange && (
        <PageSizeSelector pageSize={pageSize} options={pageSizeOptions} onChange={onPageSizeChange} />
      )}
    </div>
  );
};

export default Pagination;
