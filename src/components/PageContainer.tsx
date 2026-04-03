import React from 'react';

// ==========================================
// Types
// ==========================================

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface PageContainerProps {
  /** @deprecated Breadcrumbs are now rendered inside PageHeader via the breadcrumbs prop. This prop is kept for backwards compatibility but is no longer rendered. */
  extraBreadcrumbs?: BreadcrumbItem[];
  /** 頁面主內容 */
  children: React.ReactNode;
}

// ==========================================
// PageContainer Component
// ==========================================
//
// PageContainer （頁面容器）
// └── MainContent  （頁面主內容 — children）
//
// 注意：PageHeader 由各頁面自行放入 children，
// 以保留最大彈性（有些頁面可能不需要 header）。
// 注意：Breadcrumbs 已移至 PageHeader 內部顯示。
//

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* MainContent — 對應 Figma mainContent: flex:1, flex-col, padding 10px 20px */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-2.5">{children}</div>
    </div>
  );
};

export default PageContainer;
