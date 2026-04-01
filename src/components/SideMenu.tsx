import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// ==========================================
// Logo
// ==========================================
import LogoSvg from '../assets/icons/logo.svg';

// ==========================================
// Menu Icons (dark / light pairs)
// ==========================================
import dashboardDark from '../assets/icons/menu/dashboard-dark.svg';
import dashboardLight from '../assets/icons/menu/dashboard-light.svg';
import accountDark from '../assets/icons/menu/account-dark.svg';
import accountLight from '../assets/icons/menu/account-light.svg';
import customerDark from '../assets/icons/menu/customer-dark.svg';
import customerLight from '../assets/icons/menu/customer-light.svg';
import monitoringDark from '../assets/icons/menu/monitoring-dark.svg';
import monitoringLight from '../assets/icons/menu/monitoring-light.svg';
import analysisDark from '../assets/icons/menu/analysis-dark.svg';
import analysisLight from '../assets/icons/menu/analysis-light.svg';
import notificationDark from '../assets/icons/menu/notification-dark.svg';
import notificationLight from '../assets/icons/menu/notification-light.svg';
import settingsDark from '../assets/icons/menu/settings-dark.svg';
import settingsLight from '../assets/icons/menu/settings-light.svg';

const iconMap: Record<string, { dark: string; light: string }> = {
  dashboard: { dark: dashboardDark, light: dashboardLight },
  account: { dark: accountDark, light: accountLight },
  customer: { dark: customerDark, light: customerLight },
  monitoring: { dark: monitoringDark, light: monitoringLight },
  analysis: { dark: analysisDark, light: analysisLight },
  notification: { dark: notificationDark, light: notificationLight },
  settings: { dark: settingsDark, light: settingsLight },
};

const getIcon = (iconName: string, isActive: boolean) => {
  const pair = iconMap[iconName];
  if (!pair) return '';
  return isActive ? pair.light : pair.dark;
};

// ==========================================
// Chevron Icons (matching Google Material Icons)
// ==========================================

/** chevron_right — 收合狀態 */
const ChevronRight: React.FC<{ color?: string }> = ({ color = '#333' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9.29 6.71a1 1 0 0 0 0 1.42L13.17 12l-3.88 3.88a1 1 0 1 0 1.42 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42.01z" fill={color} />
  </svg>
);

/** expand_more — 展開狀態 */
const ExpandMore: React.FC<{ color?: string }> = ({ color = '#333' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" fill={color} />
  </svg>
);

// ==========================================
// Types
// ==========================================

interface SubMenuItem {
  label: string;
  to: string;
}

interface MenuItemConfig {
  label: string;
  icon?: string;
  to: string;
  subMenu?: SubMenuItem[];
}

// ==========================================
// Menu Data
// ==========================================

const menuData: MenuItemConfig[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    to: '/',
  },
  {
    label: '管理員管理',
    icon: 'account',
    to: '/staffs',
    subMenu: [{ label: '管理員列表', to: '/staffs' }],
  },
  {
    label: '用戶管理',
    icon: 'customer',
    to: '/users',
    subMenu: [
      { label: '使用者列表', to: '/users/userList' },
      { label: '停權使用者列表', to: '/users/suspendedList' },
      { label: '檢舉清單', to: '/users/reportList' },
    ],
  },
  {
    label: '綜合分析報表',
    icon: 'analysis',
    to: '/analysis',
    subMenu: [
      { label: '用戶分析列表', to: '/analysis/users' },
      { label: '貼文分析列表', to: '/analysis/posts' },
      { label: '用戶停留時間表', to: '/analysis/usersRetaintion' },
    ],
  },
  {
    label: '測試demo',
    icon: 'monitoring',
    to: '/test-demo',
    subMenu: [
      { label: '使用者列表', to: '/test-demo' },
      { label: '使用者內頁', to: '/user-detail-demo' },
    ],
  },
  {
    label: '通知管理',
    icon: 'notification',
    to: '/notifications',
  },
  {
    label: '設定',
    icon: 'settings',
    to: '/settings',
    subMenu: [
      { label: '地區管理', to: '/settings/region' },
      { label: '領域管理', to: '/settings/area' },
    ],
  },
];

// ==========================================
// Helper: 判斷某路徑是否為 active
// ==========================================

const isPathActive = (pathname: string, to: string, exact = false) => {
  if (exact) return pathname === to;
  return pathname === to || pathname.startsWith(to + '/');
};

// ==========================================
// SideMenu Component (仿 nexly-web menu.vue)
// ==========================================

const SideMenu: React.FC = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  // 自動展開：當前路由匹配的父級 menu 自動展開
  React.useEffect(() => {
    const next: Record<string, boolean> = {};
    menuData.forEach((item) => {
      if (item.subMenu) {
        const parentMatch = item.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.to);
        const childMatch = item.subMenu.some((sub) =>
          isPathActive(location.pathname, sub.to, true),
        );
        if (parentMatch || childMatch) next[item.to] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...next }));
  }, [location.pathname]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <nav
      className="flex flex-col box-border"
      style={{
        width: 230,
        minHeight: '100vh',
        padding: '40px 16px 16px 16px',
        gap: 24,
        background: '#FAFAFB',
        boxShadow: '2px 0px 4px 0px #0000001A',
        zIndex: 100,
      }}
    >
      {/* ===== Logo ===== */}
      <div className="flex items-center" style={{ height: 32 }}>
        <img src={LogoSvg} alt="Logo" style={{ height: 32 }} />
      </div>

      {/* ===== Menu List ===== */}
      <div className="flex-1 flex flex-col" style={{ gap: 5 }}>
        {menuData.map((item) => {
          const hasSubMenu = !!item.subMenu;
          const isOpen = !!openMenus[item.to];

          // 判斷此選單「群組」是否有 active 的項目（用於圖示/箭頭顏色）
          const isGroupActive = item.to === '/'
            ? location.pathname === '/'
            : hasSubMenu
              ? item.subMenu!.some((sub) => isPathActive(location.pathname, sub.to, true)) ||
                location.pathname.startsWith(item.to)
              : isPathActive(location.pathname, item.to, true);

          // 父層 row 本身的 active 背景：有 subMenu 的父層不亮，只讓子項目亮
          const isMenuActive = hasSubMenu ? false : isGroupActive;

          const activeTextColor = isMenuActive ? '#333' : '#333';
          const activeBg = isMenuActive ? '#DAF0FF' : 'transparent';

          return (
            <div key={item.to} className="flex flex-col">
              {/* ===== Title Row ===== */}
              {hasSubMenu ? (
                <div
                  onClick={() => toggleMenu(item.to)}
                  className="flex items-center justify-between cursor-pointer no-underline"
                  style={{
                    minHeight: 44,
                    padding: '0 12px',
                    borderRadius: 10,
                    background: activeBg,
                    color: activeTextColor,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isMenuActive) e.currentTarget.style.background = '#F4F6F7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = activeBg;
                  }}
                >
                  <div className="flex items-center" style={{ gap: 16 }}>
                    {item.icon && (
                      <img
                        src={getIcon(item.icon, isGroupActive)}
                        alt=""
                        className="w-5 h-5"
                      />
                    )}
                    <span style={{ fontSize: 14, fontWeight: 400 }}>{item.label}</span>
                  </div>
                  {isOpen
                    ? <ExpandMore color={isGroupActive ? '#1383D3' : '#333'} />
                    : <ChevronRight color={isGroupActive ? '#1383D3' : '#333'} />
                  }
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className="flex items-center justify-between no-underline"
                  style={{
                    minHeight: 44,
                    padding: '0 12px',
                    borderRadius: 10,
                    background: activeBg,
                    color: activeTextColor,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isMenuActive) e.currentTarget.style.background = '#F4F6F7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = activeBg;
                  }}
                >
                  <div className="flex items-center" style={{ gap: 16 }}>
                    {item.icon && (
                      <img
                        src={getIcon(item.icon, isGroupActive)}
                        alt=""
                        className="w-5 h-5"
                      />
                    )}
                    <span style={{ fontSize: 14, fontWeight: 400 }}>{item.label}</span>
                  </div>
                </NavLink>
              )}

              {/* ===== SubMenu ===== */}
              {hasSubMenu && isOpen && (
                <div className="flex flex-col" style={{ gap: 4, paddingTop: 4 }}>
                  {item.subMenu!.map((sub) => {
                    const isSubActive = isPathActive(location.pathname, sub.to, true);
                    const subBg = isSubActive ? '#DAF0FF' : 'transparent';
                    const subColor = isSubActive ? '#333' : '#333';

                    return (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className="flex items-center no-underline"
                        style={{
                          minHeight: 44,
                          padding: '0 12px 0 48px',
                          borderRadius: 10,
                          background: subBg,
                          color: subColor,
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubActive) e.currentTarget.style.background = '#F4F6F7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = subBg;
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: isSubActive ? 500 : 400 }}>{sub.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== Footer ===== */}
      <div style={{ fontSize: 14, color: '#999', paddingLeft: 12 }}>版本號</div>
    </nav>
  );
};

export default SideMenu;