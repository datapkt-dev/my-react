import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// ==========================================
// 路由 → 中文標籤對應表
// ==========================================

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/users': '用戶管理',
  '/users/userList': '使用者列表',
  '/users/suspendedList': '停權使用者列表',
  '/users/reportList': '檢舉清單',
  '/staffs': '管理員管理',
  '/products': '產品管理',
  '/region': '地區管理',
  '/anomaly': '異常監控',
  '/anomaly/inActiveList': '非活躍名單分析',
  '/analysis': '綜合分析報表',
  '/analysis/users': '用戶分析列表',
  '/analysis/posts': '貼文分析列表',
  '/analysis/usersRetaintion': '用戶停留時間表',
  '/settings': '設定',
  '/settings/region': '地區管理',
  '/settings/area': '領域管理',
};

// ==========================================
// Types
// ==========================================

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  /** 額外附加的麵包屑項目（例如動態的使用者名稱） */
  extra?: BreadcrumbItem[];
  /** 尺寸變體：'sm' 用於標題下方，'default' 用於獨立列 */
  size?: 'sm' | 'default';
}

// ==========================================
// Breadcrumbs Component
// ==========================================

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ extra, size = 'default' }) => {
  const location = useLocation();

  // 從 pathname 建立麵包屑陣列
  const crumbs: BreadcrumbItem[] = React.useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // 首頁永遠作為第一層
    items.push({ label: '首頁', path: '/' });

    // 逐層組合路徑
    let accumulated = '';
    for (const seg of segments) {
      accumulated += `/${seg}`;
      const label = ROUTE_LABELS[accumulated];
      if (label) {
        items.push({ label, path: accumulated });
      }
    }

    // 附加額外項目（如動態頁面名稱）
    if (extra) {
      items.push(...extra);
    }

    return items;
  }, [location.pathname, extra]);

  // 只有首頁一層時不顯示麵包屑
  if (crumbs.length <= 1) return null;

  return (
    <nav className={size === 'sm' ? 'flex items-center gap-2 h-6 text-xs' : 'flex items-center gap-2 h-10 text-sm'}>
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.path}>
            {idx > 0 && (
              <div className="w-2 h-2 border-t border-r border-text-dark rotate-45 mx-1 shrink-0" />
            )}
            {isLast ? (
              <span className="text-text-dark">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="text-text-muted hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
