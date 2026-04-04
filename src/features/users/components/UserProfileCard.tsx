import type React from 'react';

// ==========================================
// Types
// ==========================================

interface UserProfileCardProps {
  avatarUrl: string;
  name: string;
  birthday?: string;
  phone?: string;
  email?: string;
}

// ==========================================
// Avatar Placeholder
// ==========================================

const AvatarPlaceholder: React.FC<{ name: string; size?: number }> = ({ name, size = 100 }) => (
  <div
    className="flex items-center justify-center rounded"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: 'var(--color-avatar-bg)',
      fontSize: `${size * 0.36}px`,
      fontWeight: 600,
      color: 'var(--color-avatar-text)',
    }}
  >
    {name.charAt(0)}
  </div>
);

// ==========================================
// UserProfileCard Component
// 復刻 nexly-web detail.vue 左側使用者資訊卡
// 286px 寬 / 圓角 10px / box-shadow / 頭像 100x100 / 姓名 / 生日+電話
// ==========================================

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  avatarUrl,
  name,
  birthday,
  phone,
  email,
}) => {
  return (
    <div
      className="flex flex-col gap-5 p-5 rounded-[10px] shrink-0"
      style={{
        width: '286px',
        boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)',
        backgroundColor: 'var(--color-white)',
      }}
    >
      {/* 頭像 */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="rounded object-cover object-center"
          style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-avatar-bg)' }}
        />
      ) : (
        <AvatarPlaceholder name={name} size={100} />
      )}

      {/* 名稱 */}
      <div className="text-base font-medium" style={{ color: 'var(--color-text-heading)' }}>
        {name}
      </div>

      {/* 生日 & 電話 */}
      <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-heading)' }}>
        {birthday || '---'}
        <br />
        {phone || email || '---'}
      </div>
    </div>
  );
};

export default UserProfileCard;
