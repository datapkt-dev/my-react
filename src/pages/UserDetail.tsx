import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { fetchUserDetailList } from '../api/userApi';
import PageContainer from '../components/PageContainer';
import UserProfileCard from '../components/UserProfileCard';

// ==========================================
// Types
// ==========================================

interface UserDetailData {
  name: string;
  avatar_url: string;
  birthday?: string;
  phone?: string;
  email: string;
  bio?: string;
  user_id?: string;
  tales_count: number;
  personal_completed_count: number;
  personal_uncompleted_count: number;
}

// ==========================================
// BackArrow SVG
// ==========================================

const BackArrowIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ==========================================
// Helpers
// ==========================================

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '---';
  const d = dateString.split('T')[0];
  return d || '---';
};

// ==========================================
// UserDetail Page
// ==========================================

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDetailData | null>(null);

  useEffect(() => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    if (!projectId) {
      setError('無法取得專案 ID，請重新登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchUserDetailList(projectId, Number(id))
      .then((res) => {
        setUserData({
          name: res.data.name,
          birthday: formatDate(res.data.birthday),
          email: res.data.email,
          phone: res.data.phone,
          avatar_url: res.data.avatar_url,
          tales_count: res.data.tales_count,
          personal_completed_count: res.data.personal_completed_count,
          personal_uncompleted_count: res.data.personal_uncompleted_count,
        });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PageContainer
      extraBreadcrumbs={[
        { label: '使用者詳情', path: `/users/userList/${id}` },
      ]}
    >
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

      {/* ===== Loading / Error ===== */}
      {loading && (
        <div className="py-10 text-center text-sm text-text-light">載入中...</div>
      )}
      {!loading && error && (
        <div className="py-10 text-center text-sm text-danger">{error}</div>
      )}

      {/* ===== 主體：左右兩欄 ===== */}
      {!loading && !error && userData && (
        <div className="flex gap-5 flex-1 min-h-0">
          {/* ── 左側：使用者資訊卡 ── */}
          <UserProfileCard
            avatarUrl={userData.avatar_url}
            name={userData.name}
            birthday={userData.birthday}
            phone={userData.phone}
            email={userData.email}
          />

          {/* ── 右側：詳細資料 ── */}
          <div className="flex-1 flex flex-col gap-8">
            {/* 邀請人(碼) */}
            <div className="flex flex-col gap-2">
              <div className="text-base font-medium" style={{ color: '#2B2F35' }}>
                邀請人(碼)
              </div>
              <div className="text-sm" style={{ color: '#2B2F35' }}>
                {userData.bio || '---'}{' '}
                {userData.user_id && (
                  <span style={{ color: '#5F6E7B' }}>({userData.user_id})</span>
                )}
              </div>
            </div>

            {/* Pins 數 — 卡片 */}
            <div
              className="rounded-[10px] p-5 flex flex-col gap-2.5"
              style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)', backgroundColor: '#FFF' }}
            >
              <div className="text-sm" style={{ color: '#2B2F35' }}>
                Pins數
              </div>
              <div className="text-[30px] font-medium" style={{ color: '#2B2F35' }}>
                {userData.tales_count}
              </div>
            </div>

            {/* 成就達成率 — 兩張卡片 */}
            <div className="flex gap-8 w-full">
              <div
                className="flex-1 rounded-[10px] p-5 flex flex-col gap-2.5"
                style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)', backgroundColor: '#FFF' }}
              >
                <div className="text-sm" style={{ color: '#2B2F35' }}>
                  個人成就達成率
                </div>
                <div className="text-[30px] font-medium" style={{ color: '#2B2F35' }}>
                  {userData.personal_completed_count}
                </div>
              </div>
              <div
                className="flex-1 rounded-[10px] p-5 flex flex-col gap-2.5"
                style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.20)', backgroundColor: '#FFF' }}
              >
                <div className="text-sm" style={{ color: '#2B2F35' }}>
                  團體成就達成率
                </div>
                <div className="text-[30px] font-medium" style={{ color: '#2B2F35' }}>
                  {userData.personal_uncompleted_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default UserDetails;