import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import TopNavbar from './TopBar';


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
  iconPlaceholder 
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
              {iconPlaceholder || (
                // 預設的 Icon 佔位符 (簡單的方框)
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
        <img style={{ width: 112.65, height: 32 }} src="https://placehold.co/113x32" alt="Logo" />
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
        <MenuItem to="/" label="儀表板" end iconPlaceholder="📊" />
        <MenuItem to="/users" label="用戶管理" iconPlaceholder="👥" />
        <MenuItem to="/staffs" label="員工管理" iconPlaceholder="🧑‍💼" />
        <MenuItem to="/products" label="商品管理" iconPlaceholder="📦" />
        <MenuItem to="/settings" label="系統設定" iconPlaceholder="⚙️" />
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
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, background: 'white', minHeight: '100vh' }}>
        <TopNavbar user={{ name: 'Admin' }} hasUnreadNotification />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;