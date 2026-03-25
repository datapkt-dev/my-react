import { useEffect, useRef, useState } from 'react'
import { fetchUserList } from '../api/userApi'
import FilterPanel, { type FilterValues } from '../components/FilterPanel'

interface User {
  id: number
  name: string
  email?: string
  nationality: string,
  birthday: string,
  membershipType?: string,
  isBanned?: boolean,
  joinDate?: string
}

const DEFAULT_FILTERS: FilterValues = {
  account: '',
  nationality: '',
  name: '',
  city: '',
  birthday: '',
};


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
  const [filterRole, setFilterRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  const handleToggleMenu = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const applyFilters = (list: User[], filters: FilterValues): User[] => {
    return list.filter((user) => {
      const matchAccount = 
        filters.account === '' || 
        user.name?.toLowerCase().includes(filters.account?.toLowerCase());
      const matchNationality =
        filters.nationality === '' ||
        user.nationality?.toLowerCase().includes(filters.nationality?.toLowerCase());
      /*const matchCity =
        filters.city === '' ||
        user.city?.toLowerCase().includes(filters.city?.toLowerCase());*/
      const matchName =
        filters.name === '' ||
        user.name?.toLowerCase().includes(filters.name?.toLowerCase());
      const matchBirthday =
        filters.birthday === '' ||
        user.birthday?.toLowerCase().includes(filters.birthday?.toLowerCase());
      /*const matchMembership =
        filters.membershipType === '' ||
        (user.membershipType ?? '').toLowerCase().includes(filters.membershipType.toLowerCase());
      const matchBanned =
        filters.bannedStatus === 'all' ||
        (filters.bannedStatus === 'banned' ? user.isBanned === true : user.isBanned !== true);*/
      return matchAccount && matchNationality && matchName && matchBirthday /* && matchCity*/ ;
    });
  };

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
          email: s.email,
          membershipType: s.membership_type,
          isBanned: s.is_banned,
        }));
        setUsers(mapped);
        setTotal(res.data.total);
        setFilteredUsers(applyFilters(mapped, DEFAULT_FILTERS));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  },[])

  const activeFilterCount = [
    appliedFilters.account !== '',
    appliedFilters.nationality !== '',
    appliedFilters.city !== '',
    appliedFilters.name !== '',
    appliedFilters.birthday !== '',
  ].filter(Boolean).length;

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
        
        {/* 篩選按鈕 */}
        <button
          onClick={() => {
            setPendingFilters(appliedFilters);
            setIsFilterOpen(true);
          }}
          style={{
            height: 40,
            minWidth: 88,
            padding: '0 12px',
            background: activeFilterCount > 0 ? '#EBF5FF' : '#fff',
            color: activeFilterCount > 0 ? '#1383D3' : '#333',
            border: `1px solid ${activeFilterCount > 0 ? '#1383D3' : '#333'}`,
            borderRadius: 4,
            fontSize: 14,
            fontWeight: '500',
            cursor: 'pointer',
            letterSpacing: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
          }}
        >
          篩選
          {activeFilterCount > 0 && (
            <span
              style={{
                background: '#1383D3',
                color: 'white',
                borderRadius: '50%',
                width: 18,
                height: 18,
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 資料列表區塊 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* 表頭 */}
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

        {/* 資料列 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading && (
            <div style={{ padding: '20px 10px', color: '#888888', fontSize: 14, letterSpacing: 1 }}>載入中...</div>
          )}
          {!loading && error && (
            <div style={{ padding: '20px 10px', color: '#FF4444', fontSize: 14, letterSpacing: 1 }}>{error}</div>
          )}
          {!loading && !error && filteredUsers?.map((user, index) => (
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

      {/* 篩選面板 */}
      <FilterPanel
        isOpen={isFilterOpen}
        values={pendingFilters}
        onChange={setPendingFilters}
        onApply={() => {
          setAppliedFilters(pendingFilters);
          setFilteredUsers(applyFilters(users, pendingFilters));
          setIsFilterOpen(false);
        }}
        onReset={() => {
          setPendingFilters(DEFAULT_FILTERS);
          setAppliedFilters(DEFAULT_FILTERS);
          setFilteredUsers(applyFilters(users, DEFAULT_FILTERS));
          //setIsFilterOpen(false);
        }}
        onClose={() => setIsFilterOpen(false)}
        filterValue={filterRole}
        setFilterValue={() => setFilterRole}
      />
    </div>
  );
}

export default Users
