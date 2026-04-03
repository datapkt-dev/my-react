import React from 'react';
import Breadcrumbs from './Breadcrumbs';

// ==========================================
// Types
// ==========================================

interface ActionButton {
  /** 按鈕文字（例如「新增」、「匯出」） */
  label: string;
  /** 點擊事件 */
  onClick: () => void;
  /** 按鈕樣式變體 */
  variant?: 'primary' | 'outline' | 'danger' | 'filter';
  /** 按鈕前方圖示（可選） */
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  /** 頁面標題 */
  title: string;
  /** 標題旁的計數（如 "(2)"） */
  count?: number | string;
  /** 額外的麵包屑項目（如動態頁名） */
  extraBreadcrumbs?: { label: string; path: string }[];
  /** 右側操作按鈕（新增、篩選、匯出等，依陣列順序排列） */
  actionButtons?: ActionButton[];
  /** 完全自訂右側區塊（優先度高於 actionButtons） */
  actions?: React.ReactNode;
}

// ==========================================
// 樣式對照表
// ==========================================

const VARIANT_STYLES: Record<string, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  outline: 'bg-white text-text-dark border border-border hover:bg-bg-gray',
  danger: 'bg-danger text-white hover:bg-red-600',
  filter: 'bg-sidebar-active-bg text-text-dark border border-primary hover:bg-primary-light',
};

// ==========================================
// Filter Icon (SVG)
// ==========================================

export const FilterIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
    <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="5" cy="4" r="1.5" fill="white" stroke="currentColor" strokeWidth="1" />
    <circle cx="11" cy="8" r="1.5" fill="white" stroke="currentColor" strokeWidth="1" />
  </svg>
);

// ==========================================
// PageHeader Component
// ==========================================
//
// PageHeader（flex justify-between）
// ├── 左側（flex-col）
// │   ├── title + count（上）
// │   └── Breadcrumbs size="sm"（下）
// └── 右側（self-end）
//     ├── actions（自訂插槽，可選）
//     └── ActionButton[]（可選）
//
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  count,
  extraBreadcrumbs,
  actionButtons,
  actions,
}) => {
  const hasRightSide = actions || (actionButtons && actionButtons.length > 0);

  return (
    <div className="flex justify-between mb-2.5">
      {/* ── 左側：標題 + 計數（上）、Breadcrumbs（下） ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl font-medium text-text-medium m-0 tracking-wide">{title}</h1>
          {count !== undefined && (
            <span className="text-base text-text-light tracking-wide">({count})</span>
          )}
        </div>
        <Breadcrumbs extra={extraBreadcrumbs} size="sm" />
      </div>

      {/* ── 右側操作區 ── */}
      {hasRightSide && (
        <div className="flex items-center gap-2.5 self-end">
          {actions}
          {actionButtons?.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={`h-10 px-3 flex items-center justify-center gap-1.5 rounded text-sm font-medium tracking-wide transition-colors cursor-pointer min-w-[72px] ${
                VARIANT_STYLES[btn.variant ?? 'primary']
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
export type { PageHeaderProps, ActionButton };