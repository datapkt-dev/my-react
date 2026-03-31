import type React from 'react';

// ==========================================
// Types
// ==========================================

interface UserProfileCardProps {
  avatarUrl: string;
  name: string;
  birthday?: string;
  email: string;
  region?: string;
  gender?: string;
  addedDate: string;
}

// ==========================================
// Helpers
// ==========================================

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const displayValue = (value: string | undefined | null) => {
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-300">---</span>;
  }
  return value;
};

// ==========================================
// UserProfileCard Component
// 依 Figma: VERTICAL / gap-20 / p-20 / FIXED width / white bg / shadow
// ==========================================

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  avatarUrl,
  name,
  birthday,
  email,
  region,
  gender,
  addedDate,
}) => {
  return (
    <div className="w-[280px] flex flex-col gap-5 p-5 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* avatar: HORIZONTAL / CENTER cross / gap-10 / 100x100 */}
      <div className="flex items-center gap-2.5">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-[100px] h-[100px] rounded-xl object-cover"
        />
      </div>

      {/* name + info 區塊: VERTICAL / gap-20 */}
      <div className="flex flex-col gap-5">
        {/* name: text-14:942 (較大) / color rgb(51,51,51) */}
        <h2 className="text-xl text-text-dark font-semibold m-0">
          {name}
        </h2>

        {/* info 欄位群: VERTICAL / gap-10 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-sm text-text-dark">{formatDate(birthday)}</span>
          <span className="text-sm text-text-dark">{displayValue(email)}</span>
          <span className="text-sm text-text-dark">{displayValue(region)}</span>
          <span className="text-sm text-text-dark">{displayValue(gender)}</span>
          <span className="text-sm text-text-dark">{formatDate(addedDate)} 註冊</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
