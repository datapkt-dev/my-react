import { useParams, useNavigate } from 'react-router-dom';
import {useState, useEffect, use} from 'react'
import { fetchUserDetailList } from '../api/userApi';

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
    avatar_url: 'https://via.placeholder.com/80', // 替換成你的圖片路徑
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

  useEffect(() =>{
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
            avatar_url:res.data.avatar_url,
            //gender: res.data.gender,
            added_date: res.data.time_added,
            //inviter:{ name: res.data.inviter.name, code: res.data.inviter.code},
            talesCount: res.data.tales_count,
            personalRate: res.data.personal_completed_count,
            //groupRate: res.data.personal_uncompleted_count 
        }
        setUserData(data)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
      }
  ,[]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '生日未填'; // 防呆：避免 API 沒給資料時崩潰
    const date = new Date(dateString);
    // 使用 padStart 確保月份和日期是兩位數 (如 03)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // 回傳 2026-03-22
  };

  const formatDisplay = (value: any, suffix: string = '') => {
    if (value === null || value === undefined || value === '') {
      return <span style={{ color: '#C0C0C0' }}>---</span>; // 用淺灰色顯示 dash
    }
    return `${value}${suffix}`;
  };

  return (<>
    <div style={{ width: '100%', padding: '20px 28px', background: 'white', fontFamily: 'Noto Sans TC, sans-serif' }}></div>
    {/* 麵包屑 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
        <span style={{ color: '#999999', fontSize: 14 }}>用戶管理 {'>'} 使用者列表 </span>
        <div style={{ width: 4, height: 8, borderTop: '1px solid #333', borderRight: '1px solid #333', transform: 'rotate(45deg)', margin: '0 4px' }} />
        <span style={{ color: '#333333', fontSize: 14 }}>使用者詳情</span>
      </div>
    <div>
        <button style={{ gap: 10, border:'none', background:'transparent', cursor:'pointer'}}
            onClick={() => navigate(-1)}
        >
          <h1 style={{ color: '#454545', fontSize: 24, fontWeight: '500', margin: 0, letterSpacing: 0.3 }}>
            <span>←</span>
            使用者詳情
          </h1>
        </button>
    </div>
    {!loading && !error && <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      
      {/* 左側資訊欄 */}
      <div style={{ 
        width: 280, 
        background: 'white', 
        padding: '40px 24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        borderRight: '1px solid #EEEEEE',
        borderRadius: '10px'
      }}>
        <img 
          src={userData.avatar_url} 
          alt="Avatar" 
          style={{ width: 100, height: 100, borderRadius: 12, marginBottom: 20, objectFit: 'cover' }} 
        />
        <h2 style={{ fontSize: 20, color: '#333', marginBottom: 24, fontWeight: '600' }}>{userData.name}</h2>
        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, color: '#666', fontSize: 14 }}>
          <span>{formatDate(userData.birthday)}</span>
          <span>{formatDisplay(userData.email)}</span>
          <span>{formatDisplay(userData.region)}</span>
          <span>{formatDisplay(userData.gender)}</span>
          <span style={{ color: '#999', marginTop: 8 }}>{formatDate(userData.added_date)} 註冊</span>
        </div>
      </div>

      {/* 右側數據卡片區 */}
      <div style={{ flex: 1, padding: '40px' }}>
        
        {/* 邀請人資訊 */}
        <div style={{ marginBottom: 32 }}>
            <div style={cardLabelStyle}>邀請人(碼)</div>
            <div style={{ fontSize: 16, color: userData.inviter?.name ? '#333' : '#C0C0C0' }}>
                {userData.inviter?.name 
                ? `${userData.inviter.name} (${userData.inviter.code})` 
                : '無邀請人資訊'}
            </div>
        </div>
        
        {/* 第一排卡片 (Tales數) */}
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Tales數</div>
          <div style={cardValueStyle}>{formatDisplay(userData.talesCount)}</div>
        </div>

        {/* 第二排卡片 (成就率) */}
        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          <div style={{ ...cardStyle, flex: 1 }}>
            <div style={cardLabelStyle}>個人成就達成率</div>
            <div style={cardValueStyle}>{formatDisplay(userData.personalRate, '%')}</div>
          </div>
          <div style={{ ...cardStyle, flex: 1 }}>
            <div style={cardLabelStyle}>團體成就達成率</div>
            <div style={cardValueStyle}>{formatDisplay(userData.groupRate, '%')}</div>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};
    // 複用的樣式變數
    const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #F0F0F0'
    };

    const cardLabelStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500'
    };

    const cardValueStyle: React.CSSProperties = {
    fontSize: 32,
    color: '#333',
    fontWeight: '600'
    };

export default UserDetails;