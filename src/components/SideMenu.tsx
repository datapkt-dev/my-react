import React from 'react';
import { NavLink } from 'react-router-dom';

import HeaderPic from '../assets/HeaderPic.svg';
import DashboardPic from '../assets/dashboard.png';
import UserPic from '../assets/users.png';
import AdminPic from '../assets/admin_management.png';
import AnalysisPic from '../assets/report.png';
import SettingPic from '../assets/settings.png';
import NotificationPic from '../assets/notification.png';

// ==========================================
// Types & Interfaces
// ==========================================

interface MenuItemProps {
  to: string;
  label: string;
  end?: boolean;
  isSubItem?: boolean;
  hasSubItems?: boolean;
  /** 隱藏右側箭頭（預設主項目都顯示 chevron） */
  hideChevron?: boolean;
  iconUrl?: string;
  children?: React.ReactNode;
}

// ==========================================
// Chevron Arrow (24×24 container)
// ==========================================

const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div
    className={`w-6 h-6 flex items-center justify-center shrink-0 transition-transform duration-300 ${
      isOpen ? 'rotate-180' : ''
    }`}
  >
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
      <path
        d="M1 1L5 5L9 1"
        stroke="#28303F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// ==========================================
// MenuItem Component
// ==========================================

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  label,
  end = false,
  isSubItem = false,
  hasSubItems = false,
  hideChevron = false,
  iconUrl,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <NavLink
        to={to}
        end={end}
        onClick={handleToggle}
        className={({ isActive }) => {
          const base = 'w-[208px] h-11 flex items-center gap-4 no-underline rounded-[10px]';
          const padding = isSubItem ? 'pl-12 pr-3' : 'pl-3 pr-3';

          let bg = 'bg-transparent';
          if (isActive && !hasSubItems) {
            bg = isSubItem ? 'bg-primary' : 'bg-primary-light';
          }

          return `${base} ${padding} ${bg}`;
        }}
      >
        {({ isActive }) => {
          const isActiveLeaf = isActive && !hasSubItems;
          const isActiveSub = isActiveLeaf && isSubItem;

          const textColor = isActiveSub
            ? 'text-white'
            : isActiveLeaf
              ? 'text-primary'
              : 'text-text-dark';

          return (
            <>
              {/* SideMenuIcon (20×20) — 主項目才顯示 */}
              {!isSubItem && iconUrl && (
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img
                    src={iconUrl}
                    alt=""
                    className={`w-[18px] h-[18px] ${
                      isActiveLeaf
                        ? 'brightness-0 saturate-100 invert-[38%] sepia-[91%] saturate-[1353%] hue-rotate-[182deg]'
                        : ''
                    }`}
                  />
                </div>
              )}

              {/* Label — flex-1 填滿剩餘空間 */}
              <div className={`flex-1 text-sm ${textColor}`}>{label}</div>

              {/* Arrow icon (24×24) — 主項目預設顯示（匹配 Figma），hideChevron 可隱藏 */}
              {!isSubItem && !hideChevron && <ChevronIcon isOpen={hasSubItems && isOpen} />}
            </>
          );
        }}
      </NavLink>

      {/* 展開的子選單 */}
      {hasSubItems && isOpen && (
        <div className="flex flex-col">{children}</div>
      )}
    </>
  );
};

// ==========================================
// SideMenu Component (純側邊欄)
// ==========================================

const SideMenu: React.FC = () => {
  return (
    <nav className="w-60 min-h-screen pt-10 pb-5 px-4 bg-sidebar-bg flex flex-col gap-6 box-border">
      {/* Logo 區域 */}
      <div className="h-10 px-3 flex items-center gap-4">
        <img className="w-[112.65px] h-8 object-cover" src={HeaderPic} alt="Logo" />
      </div>

      {/* 選單列表區域 — 無間距，靠 h-11 自然撐開 */}
      <div className="flex-1 flex flex-col">
        <MenuItem to="/" label="Dashboard" end iconUrl={DashboardPic} />

        <MenuItem to="/staffs" label="管理員管理" iconUrl={AdminPic} hasSubItems>
          <MenuItem to="/staffs" label="管理員列表" isSubItem />
        </MenuItem>

        <MenuItem to="/users" label="用戶管理" iconUrl={UserPic} hasSubItems>
          <MenuItem to="/users/userList" label="使用者列表" isSubItem />
          <MenuItem to="/users/suspendedList" label="停權使用者列表" isSubItem />
          <MenuItem to="/users/reportList" label="檢舉清單" isSubItem />
        </MenuItem>

        {/* 異常監控（隱藏） */}
        {/* <MenuItem to="/anomaly" label="異常監控" iconUrl={AnomalyPic} hasSubItems>
          <MenuItem to="/anomaly/inActiveList" label="非活躍名單分析" isSubItem />
        </MenuItem> */}

        <MenuItem to="/analysis" label="綜合分析報表" iconUrl={AnalysisPic} hasSubItems>
          <MenuItem to="/analysis/users" label="用戶分析列表" isSubItem />
          <MenuItem to="/analysis/posts" label="貼文分析列表" isSubItem />
          <MenuItem to="/analysis/usersRetaintion" label="用戶停留時間表" isSubItem />
        </MenuItem>

        <MenuItem to="/notifications" label="通知管理" iconUrl={NotificationPic} hideChevron />

        <MenuItem to="/settings" label="設定" iconUrl={SettingPic} hasSubItems>
          <MenuItem to="/settings/region" label="地區管理" isSubItem />
          <MenuItem to="/settings/area" label="領域管理" isSubItem />
        </MenuItem>
      </div>

      {/* 底部版本號 */}
      <div className="text-text-muted text-sm pl-3">版本號</div>
    </nav>
  );
};

export default SideMenu;