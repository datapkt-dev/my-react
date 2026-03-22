import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../api/authApi';
import TopNavbar from './TopBar';

import HeaderPic from '../assets/HeaderPic.png'
import DashboardPic from '../assets/dashboard.png'
import UserPic from '../assets/users.png'
import AdminPic from '../assets/admin_management.png'
import SettingPic from '../assets/settings.png'


// ==========================================
// Types & Interfaces
// ==========================================

interface MenuItemProps {
  to: string;
  label: string;
  end?: boolean; // NavLink 的 end 屬性，用於精確匹配 "/"
  isSubItem?: boolean;
  hasSubItems?: boolean;
  // 未來你可以傳入真正的 SVG 或 React Icon 組件
  iconPlaceholder?: React.ReactNode; 
  iconUrl?: string;
}

// ==========================================
// Reusable Components
// ==========================================

/**
 * 側邊欄單一選單項目 Component（整合 NavLink 路由導航）
 */
const MenuItem: React.FC<MenuItemProps> = ({ 
  to,
  label, 
  end = false,
  isSubItem = false, 
  hasSubItems = false,
  iconPlaceholder,
  iconUrl
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        width: 208,
        height: 44,
        paddingLeft: isSubItem ? 48 : 12, // 子項目向右縮排
        paddingRight: 12,
        background: isActive ? '#DAF0FF' : 'transparent',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 16,
        cursor: 'pointer',
        textDecoration: 'none',
      })}
    >
      {({ isActive }) => (
        <>
          {/* Icon 區域：如果是子項目則不顯示 Icon */}
          {!isSubItem && (
            <div 
              style={{ 
                width: 20, 
                height: 20, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              {iconUrl ? (
                <img 
                  src={iconUrl} 
                  alt={label} 
                  style={{ 
                    width: 18, 
                    height: 18, 
                    objectFit: 'contain',
                    // 如果 PNG 是純黑色，想在選中時變色，可以用 filter (稍微進階的技巧)
                    filter: isActive ? 'invert(38%) sepia(91%) saturate(1353%) hue-rotate(182deg) brightness(91%) contrast(92%)' : 'none'
                  }} 
                />
              ) : (
                <div style={{ width: 14, height: 14, border: `1.5px solid ${isActive ? '#1383D3' : '#28303F'}` }} />
              )}
            </div>
          )}
          
          {/* 文字標籤 */}
          <div
            style={{
              flex: 1,
              color: isActive ? '#1383D3' : '#333333',
              fontSize: 14,
              fontFamily: 'Noto Sans TC, sans-serif',
              fontWeight: '400',
              lineHeight: '16.8px',
              wordWrap: 'break-word',
            }}
          >
            {label}
          </div>

          {/* 右側展開/收合箭頭佔位 */}
          {hasSubItems && (
            <div 
              style={{ 
                width: 24, 
                height: 24, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              {/* 用 CSS 畫一個簡單的向下箭頭 */}
              <div 
                style={{ 
                  width: 8, 
                  height: 8, 
                  borderBottom: `1.5px solid ${isActive ? '#1383D3' : '#28303F'}`, 
                  borderRight: `1.5px solid ${isActive ? '#1383D3' : '#28303F'}`, 
                  transform: 'rotate(45deg)', 
                  marginBottom: 4 
                }} 
              />
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

// ==========================================
// Main Sidebar Component
// ==========================================

const Sidebar: React.FC = () => {
  return (
    <div
      style={{
        width: 240, // 設定固定的側邊欄寬度
        height: '100%', // 或設定為 944px，依據你的外層容器決定
        minHeight: '100vh',
        paddingTop: 40,
        paddingBottom: 20,
        paddingLeft: 16,
        paddingRight: 16,
        background: '#FAFAFB',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 24,
        boxSizing: 'border-box', // 確保 padding 不會撐破 width
      }}
    >
      {/* Logo 區域 */}
      <div
        style={{
          alignSelf: 'stretch',
          height: 40,
          paddingLeft: 12,
          paddingRight: 12,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <img style={{ width: 112.65, height: 32,  objectFit:'cover'}} src={HeaderPic} alt="Logo" />
      </div>

      {/* 選單列表區域 */}
      <div
        style={{
          alignSelf: 'stretch',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 8, // Figma 程式碼沒有寫 gap，但我加上 8px 讓項目間有呼吸空間
        }}
      >
        <MenuItem to="/" label="儀表板" end iconPlaceholder="📊" iconUrl={DashboardPic}/>
        <MenuItem to="/users" label="用戶管理" iconPlaceholder="👥" iconUrl={UserPic} hasSubItems={true} />
        <MenuItem to="/staffs" label="員工管理" iconPlaceholder="🧑‍💼" iconUrl={AdminPic}/>
        <MenuItem to="/products" label="商品管理" iconPlaceholder="📦" iconUrl={UserPic}/>
        <MenuItem to="/settings" label="系統設定" iconPlaceholder="⚙️" iconUrl={SettingPic}/>
      </div>

      {/* 底部版本號 */}
      <div
        style={{
          color: '#999999',
          fontSize: 14,
          fontFamily: 'Noto Sans TC, sans-serif',
          fontWeight: '400',
          letterSpacing: 0.70,
          wordWrap: 'break-word',
          paddingLeft: 12, // 對齊上方的選單文字
        }}
      >
        版本號
      </div>
    </div>
  );
};

// ==========================================
// Layout Component (包裝 Sidebar + 主內容區)
// ==========================================

const Layout: React.FC = () => {
  const navigate = useNavigate();

  // 從 localStorage 讀取登入者名稱
  const staffRaw = localStorage.getItem('staff');
  const staff = staffRaw ? JSON.parse(staffRaw) : null;
  const userName = staff?.name || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, background: 'white', minHeight: '100vh' }}>
        <TopNavbar user={{ name: userName }} hasUnreadNotification onLogout={handleLogout} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;