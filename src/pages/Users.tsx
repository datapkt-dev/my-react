import { useEffect, useRef, useState } from 'react'
import { fetchUserList, fetchUserDetailList } from '../api/userApi'

interface User {
  id: number
  name: string
  email?: string
  //role: string
  //status: '啟用' | '停用'
  nationality: string,
  birthday: string,
  joinDate?: string
}


/**
 * 操作下拉選單 Component
 */
const ActionDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外面關閉選單的邏輯
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        width: 200,
        padding: 10,
        position: 'absolute',
        right: 0,
        top: 36, // 讓選單長在三個點點的下方
        background: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.10)',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100, // 確保選單不會被下方的表格列蓋住
      }}
    >
      <div style={{ padding: '0 10px', height: 40, display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: 4, color: '#333333', fontSize: 14 }}>
        查看
      </div>
    </div>
  );
};


/**
 * 表格的單一資料列 (Row)
 */
const UserTableRow: React.FC<{ user: User; index: number; isMenuOpen: boolean; toggleMenu: () => void; closeMenu: () => void }> = ({ user, index, isMenuOpen, toggleMenu, closeMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const zebraColor = index % 2 === 0 ? 'white' : '#F5F5F5';
  const backgroundColor = isHovered ? '#E0E0E0' : zebraColor;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        height: 56,
        background: backgroundColor,
      }}
    >
      <div style={{ width: 160, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{user?.name}</div>
      <div style={{ width: 100, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{user?.nationality}</div>
      <div style={{ width: 160, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{user?.name}</div>
      <div style={{ flex: 1, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{formatDate(user.birthday)}</div>
      
      {/* 操作欄位 (包含按鈕與下拉選單) */}
      <div style={{ width: 50, padding: '0 10px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            gap: 3,
            alignItems: 'center',
          }}
          onClick={(e) => {
            e.stopPropagation(); // 避免觸發外層的其他點擊事件
            toggleMenu();
          }}
        >
          <div style={{ width: 3, height: 3, background: '#28303F', borderRadius: '50%' }} />
          <div style={{ width: 3, height: 3, background: '#28303F', borderRadius: '50%' }} />
          <div style={{ width: 3, height: 3, background: '#28303F', borderRadius: '50%' }} />
        </button>

        {/* 呼叫下拉選單 */}
        <ActionDropdown isOpen={isMenuOpen} onClose={closeMenu} />
      </div>
    </div>
  );
};

const initialUsers: User[] = [
  { id: 1, name: '王小明', email: 'wang@example.com', /*role: '管理員', status: '啟用',*/ birthday: '2025-01-15', nationality: 'Taiwan'},
  { id: 2, name: '李美麗', email: 'li@example.com', /*role: '編輯', status: '啟用',*/ birthday: '2025-02-20', nationality: 'American' },
  { id: 3, name: '張大偉', email: 'zhang@example.com', /*role: '使用者', status: '停用',*/ birthday: '2025-03-10', nationality: 'Taiwan' },
  { id: 4, name: '陳怡君', email: 'chen@example.com', /*role: '使用者', status: '啟用',*/ birthday: '2025-04-05', nationality: 'Taiwan' },
  { id: 5, name: '林志豪', email: 'lin@example.com', /*role: '編輯', status: '啟用',*/ birthday: '2025-05-12', nationality: 'Taiwan' },
  { id: 6, name: '黃淑芬', email: 'huang@example.com', /*role: '使用者', status: '停用',*/ birthday: '2025-06-18', nationality: 'Taiwan' },
]

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '--'; // 防呆：避免 API 沒給資料時崩潰
  
  const date = new Date(dateString);
  
  // 使用 padStart 確保月份和日期是兩位數 (如 03)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`; // 回傳 2026-03-22
};

const Users:React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  //const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleToggleMenu = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  /*const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === '啟用' ? '停用' : '啟用' } : u
      )
    )
  }*/

  useEffect(() => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    if (!projectId) {
      setError('無法取得專案 ID，請重新登入');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchUserList(projectId)
      .then((res) => {
        const mapped = res.data.items.map((s) => ({
          id: s.id,
          name: s.name,
          birthday: s.birthday,
          nationality: s.country,
          email: s.email
        }));
        setUsers(mapped);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  },[])

  return (
    <div style={{ width: '100%', padding: '20px 28px', background: 'white', fontFamily: 'Noto Sans TC, sans-serif' }}>
      
      {/* 麵包屑 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
        <span style={{ color: '#999999', fontSize: 14 }}>用戶管理</span>
        <div style={{ width: 4, height: 8, borderTop: '1px solid #333', borderRight: '1px solid #333', transform: 'rotate(45deg)', margin: '0 4px' }} />
        <span style={{ color: '#333333', fontSize: 14 }}>使用者列表</span>
      </div>

      {/* 頁面標題與操作區 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 48, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 style={{ color: '#454545', fontSize: 24, fontWeight: '500', margin: 0, letterSpacing: 0.3 }}>使用者列表</h1>
          <span style={{ color: '#888888', fontSize: 16, letterSpacing: 1 }}>({total})</span>
        </div>
        
        {/* 新增按鈕 */}
        <button
          onClick={() => {}}
          style={{
            height: 40,
            minWidth: 88,
            padding: '0 12px',
            background: '#fff',
            color: '#333',
            border: '1px solid #333',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: '500',
            cursor: 'pointer',
            letterSpacing: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          篩選
        </button>
      </div>

      {/* 資料列表區塊 (移除外層多餘的包裝與陰影，直接貼齊白底) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* 表頭 (Table Header) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            height: 52,
            background: 'white',
            borderBottom: '1px solid #DEE2E6',
          }}
        >
          <div style={{ width: 160, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>會員帳號</div>
          <div style={{ width: 100, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>國籍城市</div>
          <div style={{ width: 160, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>姓名</div>
          <div style={{ flex: 1, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>生日</div>
          <div style={{ width: 50, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1, textAlign: 'center' }}>操作</div>
        </div>

        {/* 資料列 (Table Body) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading && (
            <div style={{ padding: '20px 10px', color: '#888888', fontSize: 14, letterSpacing: 1 }}>載入中...</div>
          )}
          {!loading && error && (
            <div style={{ padding: '20px 10px', color: '#FF4444', fontSize: 14, letterSpacing: 1 }}>{error}</div>
          )}
          {!loading && !error && users?.map((user, index) => (
            <UserTableRow 
              key={user?.id} 
              user={user} 
              index={index}
              isMenuOpen={openDropdownId === user?.id}
              toggleMenu={() => handleToggleMenu(user?.id)}
              closeMenu={() => setOpenDropdownId(null)}
            />
          ))}
        </div>
        
      </div>

      {/*<AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          console.log('新增員工資料：', data);
          setIsAddModalOpen(false);
        }}
        />*/}
    </div>
  );
}

export default Users
