import React, { useState, useRef, useEffect } from 'react';

// ==========================================
// Types & Interfaces
// ==========================================

interface UserProfile {
  name: string;
  avatarUrl?: string; // 可選，如果沒有會顯示預設的灰底圈圈
}

interface TopNavbarProps {
  user: UserProfile;
  hasUnreadNotification?: boolean; // 控制通知鈴鐺上的紅點
  onLogout?: () => void; // 登出回呼
}

// ==========================================
// Reusable Components
// ==========================================

/**
 * 通知鈴鐺按鈕 Component
 */
const NotificationButton: React.FC<{ hasUnread?: boolean }> = ({ hasUnread }) => {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        background: '#F4F6F7',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      {/* 鈴鐺 Icon 的佔位區域 */}
      <div 
        style={{ 
          width: 24, 
          height: 24, 
          position: 'relative', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        {/* 用簡單的框線暫代鈴鐺 Icon */}
        <div style={{ width: 14, height: 16, border: '1.5px solid #333', borderRadius: '4px 4px 0 0' }} />
        
        {/* 未讀紅點 (這裡保留 absolute 是合理的，因為它是附屬在 Icon 右上角的角標) */}
        {hasUnread && (
          <div
            style={{
              width: 6, // 稍微調大一點比較明顯
              height: 6,
              position: 'absolute',
              top: 0,
              right: 2,
              background: '#FF3A3A',
              borderRadius: '50%',
            }}
          />
        )}
      </div>
    </div>
  );
};

/**
 * 使用者資訊區塊 Component
 */
const UserProfileMenu: React.FC<{ user: UserProfile; onLogout?: () => void }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      style={{
        height: 44,
        paddingLeft: 10,
        paddingRight: 10,
        background: '#F4F6F7',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
      }}
    >
      {/* 使用者大頭貼 */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#DEE2E6', // 如果沒有圖片的預設底色
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={`${user.name}'s avatar`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          // 預設的大頭貼 Icon 佔位
          <div style={{ width: 16, height: 16, background: '#999', borderRadius: '50%' }} />
        )}
      </div>

      {/* 使用者名稱 */}
      <div
        style={{
          color: '#333333',
          fontSize: 16,
          fontFamily: 'Noto Sans TC, sans-serif',
          fontWeight: '400',
          lineHeight: '19.2px',
          wordWrap: 'break-word',
        }}
      >
        {user.name}
      </div>

      {/* 下拉箭頭 Icon 佔位 */}
      <div 
        style={{ 
          width: 20, 
          height: 20, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        {/* 簡單的向下箭頭 */}
        <div 
          style={{ 
            width: 6, 
            height: 6, 
            borderBottom: '1.5px solid #28303F', 
            borderRight: '1.5px solid #28303F', 
            transform: 'rotate(45deg)',
            marginBottom: 4 
          }} 
        />
      </div>
    </div>

      {/* 下拉選單 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 0,
            width: 160,
            background: 'white',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
            borderRadius: 10,
            padding: 6,
            zIndex: 200,
          }}
        >
          <div
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            style={{
              padding: '10px 14px',
              fontSize: 14,
              fontFamily: 'Noto Sans TC, sans-serif',
              color: '#FF4444',
              cursor: 'pointer',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF5F5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            🚪 登出
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Main TopNavbar Component
// ==========================================

const TopNavbar: React.FC<TopNavbarProps> = ({ user, hasUnreadNotification = false, onLogout }) => {
  return (
    <div
      style={{
        width: '100%',
        height: 64, // 從原本內層推算出來的合理高度
        paddingLeft: 20,
        paddingRight: 20,
        background: 'white',
        display: 'flex',
        justifyContent: 'flex-end', // 將內容推到最右側
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* 導覽列右側的按鈕群組 */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: 10 
        }}
      >
        <NotificationButton hasUnread={hasUnreadNotification} />
        <UserProfileMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  );
};

export default TopNavbar;

/* // 💡 使用範例：
// 在你的 Dashboard 頁面中，可以這樣使用這個元件：

const App = () => {
  const currentUser = {
    name: 'Robert Allen',
    avatarUrl: 'https://placehold.co/32x32',
  };

  return (
    <TopNavbar user={currentUser} hasUnreadNotification={true} />
  );
};
*/