import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

// ==========================================
// Mock Data
// ==========================================

interface MockUserDetail {
  avatar_url: string;
  name: string;
  birthday: string;
  phone: string;
  bio: string;
  user_id: string;
  tales_count: number;
  personal_completed_count: number;
  personal_uncompleted_count: number;
}

const MOCK_USER: MockUserDetail = {
  avatar_url: '',
  name: '王小明',
  birthday: '1995-06-15',
  phone: '0912-345-678',
  bio: 'Tom Wang',
  user_id: 'USR-20250301-0042',
  tales_count: 61,
  personal_completed_count: 20,
  personal_uncompleted_count: 15,
};

// ==========================================
// BackArrow SVG
// ==========================================

const BackArrowIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

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
// UserDetailDemo Page
// ==========================================

const UserDetailDemo: React.FC = () => {
  const navigate = useNavigate();
  const [userData] = useState<MockUserDetail>(MOCK_USER);

  return (
    <PageContainer>
      {/* ===== 標題列（含返回按鈕） ===== */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2.5 border-none bg-transparent cursor-pointer p-0"
        >
          <span className="text-text-medium flex items-center">
            <BackArrowIcon />
          </span>
          <h1 className="text-2xl font-medium text-text-medium m-0 tracking-wide">
            使用者詳情
          </h1>
        </button>
      </div>

      {/* ===== 主體：左右兩欄 ===== */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* ── 左側：使用者資訊卡 ── */}
        <div
          className="flex flex-col gap-5 p-5 rounded-[10px] shrink-0"
          style={{
            width: '286px',
            boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)',
            backgroundColor: 'var(--color-white)',
          }}
        >
          {/* 頭像 */}
          {userData.avatar_url ? (
            <img
              src={userData.avatar_url}
              alt={userData.name}
              className="rounded object-cover object-center"
              style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-avatar-bg)' }}
            />
          ) : (
            <AvatarPlaceholder name={userData.name} size={100} />
          )}

          {/* 名稱 */}
          <div className="text-base font-medium" style={{ color: 'var(--color-text-heading)' }}>
            {userData.name}
          </div>

          {/* 生日 & 電話 */}
          <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-heading)' }}>
            {userData.birthday}
            <br />
            {userData.phone}
          </div>
        </div>

        {/* ── 右側：詳細資料 ── */}
        <div className="flex-1 flex flex-col gap-8">
          {/* 邀請人(碼) */}
          <div className="flex flex-col gap-2">
            <div className="text-base font-medium" style={{ color: 'var(--color-text-heading)' }}>
              邀請人(碼)
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-heading)' }}>
              {userData.bio}{' '}
              <span style={{ color: 'var(--color-text-secondary)' }}>({userData.user_id})</span>
            </div>
          </div>

          {/* Pins 數 — 卡片 */}
          <div
            className="rounded-[10px] p-5 flex flex-col gap-2.5"
            style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)', backgroundColor: 'var(--color-white)' }}
          >
            <div className="text-sm" style={{ color: 'var(--color-text-heading)' }}>
              Pins數
            </div>
            <div className="text-[30px] font-medium" style={{ color: 'var(--color-text-heading)' }}>
              {userData.tales_count}
            </div>
          </div>

          {/* 成就達成率 — 兩張卡片 */}
          <div className="flex gap-8 w-full">
            <div
              className="flex-1 rounded-[10px] p-5 flex flex-col gap-2.5"
              style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)', backgroundColor: 'var(--color-white)' }}
            >
              <div className="text-sm" style={{ color: 'var(--color-text-heading)' }}>
                個人成就達成率
              </div>
              <div className="text-[30px] font-medium" style={{ color: 'var(--color-text-heading)' }}>
                {userData.personal_completed_count}
              </div>
            </div>
            <div
              className="flex-1 rounded-[10px] p-5 flex flex-col gap-2.5"
              style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)', backgroundColor: 'var(--color-white)' }}
            >
              <div className="text-sm" style={{ color: 'var(--color-text-heading)' }}>
                團體成就達成率
              </div>
              <div className="text-[30px] font-medium" style={{ color: 'var(--color-text-heading)' }}>
                {userData.personal_uncompleted_count}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UserDetailDemo;
