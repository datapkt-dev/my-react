import React, { useState, useRef, useEffect } from 'react';
import NotificationIcon from '../../../assets/notification.png';

// ==========================================
// Types & Interfaces
// ==========================================

interface UserProfile {
  name: string;
  avatarUrl?: string;
}

interface TopBarProps {
  user: UserProfile;
  hasUnreadNotification?: boolean;
  onLogout?: () => void;
}

// ==========================================
// Notification Button (44×44, rounded-[10px], bg-gray)
// ==========================================

const NotificationButton: React.FC<{ hasUnread?: boolean }> = ({ hasUnread }) => (
  <div className="w-11 h-11 bg-bg-gray rounded-[10px] flex items-center justify-center cursor-pointer relative">
    <img className="w-6 h-6" src={NotificationIcon} alt="通知" />
    {hasUnread && (
      <span className="w-1.5 h-1.5 absolute top-2.5 right-2.5 bg-danger rounded-full" />
    )}
  </div>
);

// ==========================================
// Chevron Down Icon (~21×20)
// ==========================================

const ChevronDown: React.FC = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" className="shrink-0">
    <path
      d="M6.5 8L10.5 12L14.5 8"
      stroke="var(--color-icon-dark)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ==========================================
// User Profile Menu
// ==========================================

const UserProfileMenu: React.FC<{ user: UserProfile; onLogout?: () => void }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-11 px-2.5 bg-bg-gray rounded-[10px] flex items-center gap-2 cursor-pointer"
      >
        {/* Avatar — 36×36 外框 + 32×32 內圈 */}
        <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-sidemenu-active-bg flex items-center justify-center">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-primary font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Username */}
        <span className="text-text-dark text-base whitespace-nowrap">{user.name}</span>

        {/* Dropdown Arrow */}
        <ChevronDown />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[50px] right-0 w-40 bg-white shadow-lg rounded-[10px] p-1.5 z-[200]">
          <div
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className="px-3.5 py-2.5 text-sm text-danger cursor-pointer rounded-md flex items-center gap-2 hover:bg-danger-light"
          >
            🚪 登出
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// TopBar Component
// ==========================================

const TopBar: React.FC<TopBarProps> = ({ user, hasUnreadNotification = false, onLogout }) => (
  <div className="w-full px-5 py-2.5 bg-white flex justify-end items-center">
    <div className="flex items-center gap-2.5">
      <NotificationButton hasUnread={hasUnreadNotification} />
      <UserProfileMenu user={user} onLogout={onLogout} />
    </div>
  </div>
);

export default TopBar;