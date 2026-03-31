import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { fetchUserDetailList } from '../api/userApi';
import UserProfileCard from '../components/UserProfileCard';

interface UserDetailData {
  name: string;
  avatar_url: string;
  birthday?: string;
  email: string;
  region?: string;
  gender?: string;
  added_date: string;
  inviter?: { name: string; code: string };
  talesCount: number;
  personalRate: number;
  groupRate?: number;
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDetailData>({
    name: 'Emily Lin',
    avatar_url: 'https://via.placeholder.com/80',
    birthday: '1999/12/12',
    email: 'emilylin1234@example.com',
    region: '北美',
    gender: '女性',
    added_date: '2026-03-25T17:40:37+08:00',
    inviter: { name: 'Tom', code: 'abcd54321' },
    talesCount: 61,
    personalRate: 20,
    groupRate: 20,
  });

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
        const data = {
          name: res.data.name,
          birthday: res.data.birthday,
          email: res.data.email,
          region: res.data.country,
          avatar_url: res.data.avatar_url,
          added_date: res.data.time_added,
          talesCount: res.data.tales_count,
          personalRate: res.data.personal_completed_count,
        }
        setUserData(data)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  const formatDisplay = (value: any, suffix: string = '') => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-300">---</span>;
    }
    return `${value}${suffix}`;
  };

  return (
    <>
      <div className="w-full py-5 px-7 bg-white font-sans">
        {/* 麵包屑 */}
        <div className="flex items-center gap-2 h-10">
          <span className="text-text-muted text-sm">用戶管理 {'>'} 使用者列表</span>
          <div className="w-1 h-2 border-t border-r border-[#333] rotate-45 mx-1" />
          <span className="text-text-dark text-sm">使用者詳情</span>
        </div>

        <div>
          <button
            className="border-none bg-transparent cursor-pointer gap-2.5"
            onClick={() => navigate(-1)}
          >
            <h1 className="text-text-medium text-2xl font-medium m-0 tracking-wide">
              <span>←</span> 使用者詳情
            </h1>
          </button>
        </div>

        {!loading && !error && (
          <div className="flex min-h-screen bg-white">
            {/* 左側資訊欄 */}
            <UserProfileCard
              avatarUrl={userData.avatar_url}
              name={userData.name}
              birthday={userData.birthday}
              email={userData.email}
              region={userData.region}
              gender={userData.gender}
              addedDate={userData.added_date}
            />

            {/* 右側數據卡片區 */}
            <div className="flex-1 p-10">
              {/* 邀請人資訊 */}
              <div className="mb-8">
                <div className="text-sm text-[#666] mb-3 font-medium">邀請人(碼)</div>
                <div className={`text-base ${userData.inviter?.name ? 'text-text-dark' : 'text-gray-300'}`}>
                  {userData.inviter?.name
                    ? `${userData.inviter.name} (${userData.inviter.code})`
                    : '無邀請人資訊'}
                </div>
              </div>

              {/* Tales數 */}
              <div className="bg-white rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#F0F0F0]">
                <div className="text-sm text-[#666] mb-3 font-medium">Tales數</div>
                <div className="text-[32px] text-text-dark font-semibold">{formatDisplay(userData.talesCount)}</div>
              </div>

              {/* 成就率 */}
              <div className="flex gap-6 mt-6">
                <div className="flex-1 bg-white rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#F0F0F0]">
                  <div className="text-sm text-[#666] mb-3 font-medium">個人成就達成率</div>
                  <div className="text-[32px] text-text-dark font-semibold">{formatDisplay(userData.personalRate, '%')}</div>
                </div>
                <div className="flex-1 bg-white rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#F0F0F0]">
                  <div className="text-sm text-[#666] mb-3 font-medium">團體成就達成率</div>
                  <div className="text-[32px] text-text-dark font-semibold">{formatDisplay(userData.groupRate, '%')}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetails;