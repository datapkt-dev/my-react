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
  variant?: 'primary' | 'outline' | 'danger';
  /** 按鈕前方圖示（可選） */
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  /** 頁面標題 */
  title: string;
  /** 標題旁的計數（如 "(2)"） */
  count?: number | string;
  /** 日期範圍文字（如 "起迄日期：2025/08/01 ~ 2025/08/31"） */
  dateRange?: string;
  /** 是否顯示篩選按鈕 */
  showFilter?: boolean;
  /** 篩選按鈕點擊事件 */
  onFilterClick?: () => void;
  /** 篩選按鈕文字（預設「篩選」） */
  filterLabel?: string;
  /** 右側操作按鈕（可傳入一個或多個） */
  actionButtons?: ActionButton[];
  /** 完全自訂的右側區塊（優先度高於 actionButtons） */
  actions?: React.ReactNode;
  /** 額外附加的麵包屑項目（用於動態頁面名稱，傳給 Breadcrumbs 的 extra prop） */
  extraBreadcrumbs?: { label: string; path: string }[];
}

// ==========================================
// 樣式對照表
// ==========================================

const VARIANT_STYLES: Record<string, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  outline: 'bg-white text-text-dark border border-border hover:bg-bg-gray',
  danger: 'bg-danger text-white hover:bg-red-600',
};

// ==========================================
// Filter Icon (SVG)
// ==========================================

const FilterIcon: React.FC = () => (
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
// PageHeader
// ├── Breadcrumbs（內建，自動從路由產生，size="sm"）
// ├── 標題列（flex justify-between）
// │   ├── 左側：標題 + 計數
// │   └── 右側：DateRange / 篩選按鈕 / ActionButtons
//

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  count,
  dateRange,
  showFilter = false,
  onFilterClick,
  filterLabel = '篩選',
  actionButtons,
  actions,
  extraBreadcrumbs,
}) => {
  const hasRightSide =
    actions || dateRange || showFilter || (actionButtons && actionButtons.length > 0);

  return (
    <div className="flex flex-col mb-2.5">
      <Breadcrumbs extra={extraBreadcrumbs} size="sm" />
      <div className="flex items-center justify-between">
        {/* ── 左側：標題 + 計數 ── */}
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-2xl font-medium text-text-medium m-0 tracking-wide">{title}</h1>
          {count !== undefined && (
            <span className="text-base text-text-light tracking-wide">({count})</span>
          )}
        </div>

        {/* ── 右側操作區 ── */}
        {hasRightSide && (
          <div className="flex items-center gap-2.5">
            {/* 完全自訂插槽（最高優先） */}
            {actions}

            {/* 日期範圍 Chip */}
            {dateRange && (
              <div className="h-10 px-4 flex items-center rounded-md bg-sidebar-active-bg text-sm text-primary tracking-wide">
                {dateRange}
              </div>
            )}

            {/* 分隔線（日期 + 篩選 同時存在時） */}
            {dateRange && showFilter && (
              <div className="w-px h-7 bg-border" />
            )}

            {/* 篩選按鈕 */}
            {showFilter && (
              <button
                onClick={onFilterClick}
                className="h-10 px-3 flex items-center gap-1 rounded border border-primary bg-sidebar-active-bg text-sm text-text-dark tracking-wide hover:bg-primary-light transition-colors cursor-pointer"
              >
                <FilterIcon />
                {filterLabel}
              </button>
            )}

            {/* 操作按鈕群組 */}
            {actionButtons?.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className={`h-10 min-w-[88px] px-3 flex items-center justify-center gap-1.5 rounded text-sm font-medium tracking-wide transition-colors cursor-pointer ${
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
    </div>
  );
};

export default PageHeader;
export type { PageHeaderProps, ActionButton };
