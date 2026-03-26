import React, { useState, useRef, useEffect } from 'react';
import AddRegion from '../components/AddRegion';

// ==========================================
// Types & Interfaces
// ==========================================

interface RegionData {
  id: number;
  region: string;
  memberPings: number;
  nonMemberPings: number;
}

const initalRegions: RegionData[] = [
    {id: 1, region:'北美', memberPings:10, nonMemberPings:20},
    {id: 2, region:'加拿大', memberPings:10, nonMemberPings:20},
]

// ==========================================
// Reusable Components
// ==========================================

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
      <div style={{ padding: '0 10px', height: 40, display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: 4, color: '#FF4444', fontSize: 14 }}>
        刪除
      </div>
    </div>
  );
};

/**
 * 表格的單一資料列 (Row)
 */
const RegionTableRow: React.FC<{ region: RegionData; index: number; isMenuOpen: boolean; toggleMenu: () => void; closeMenu: () => void }> = ({ region, index, isMenuOpen, toggleMenu, closeMenu }) => {
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
      <div style={{ width: 160, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{region.region}</div>
      <div style={{ width: 160, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{region.memberPings}</div>
      <div style={{ flex: 1, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{region.nonMemberPings}</div>
      
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

// ==========================================
// Main Page Component
// ==========================================

const Region: React.FC = () => {
  const [regions, setRegions] = useState<RegionData[]>(initalRegions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<string | null | number>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  /*useEffect(() => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    if (!projectId) {
      setError('無法取得專案 ID，請重新登入');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchStaffList(projectId)
      .then((res) => {
        const mapped = res.data.items.map((s) => ({
          id:s.id,
          region:s.region,
          memberPings:s.pings,
          nonMemberPings:s.nonPings,
        }));
        setRegions(mapped);
        setTotal(res.data.total);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);*/

  // 處理開啟哪一個選單
  const handleToggleMenu = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ width: '100%', padding: '20px 28px', background: 'white', fontFamily: 'Noto Sans TC, sans-serif' }}>
      
      {/* 麵包屑 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
        <span style={{ color: '#999999', fontSize: 14 }}>設定</span>
        <div style={{ width: 4, height: 8, borderTop: '1px solid #333', borderRight: '1px solid #333', transform: 'rotate(45deg)', margin: '0 4px' }} />
        <span style={{ color: '#333333', fontSize: 14 }}>地區管理</span>
      </div>

      {/* 頁面標題與操作區 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 48, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 style={{ color: '#454545', fontSize: 24, fontWeight: '500', margin: 0, letterSpacing: 0.3 }}>地區管理</h1>
          <span style={{ color: '#888888', fontSize: 16, letterSpacing: 1 }}>({total})</span>
        </div>
        
        {/* 新增按鈕 */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            height: 40,
            minWidth: 88,
            padding: '0 12px',
            background: '#1383D3',
            color: 'white',
            border: 'none',
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
          新增
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
          <div style={{ width: 160, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>地區名稱</div>
          <div style={{ width: 160, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>會員Ping數</div>
          <div style={{ flex: 1, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>非會員Ping數</div>
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
          {!loading && !error && regions.map((region, index) => (
            <RegionTableRow 
              key={region.id} 
              region={region} 
              index={index}
              isMenuOpen={openDropdownId === region.id}
              toggleMenu={() => handleToggleMenu(region.id)}
              closeMenu={() => setOpenDropdownId(null)}
            />
          ))}
        </div>
        
      </div>

      <AddRegion
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          console.log('新增員工資料：', data);
          setIsAddModalOpen(false);
        }}
      />

    </div>
  );
};

export default Region;