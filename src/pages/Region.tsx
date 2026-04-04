import React, { useState, useRef, useEffect } from 'react';
import AddRegion from '../features/settings/components/AddRegionModal';

interface RegionData {
  id: number;
  region: string;
  memberPings: number;
  nonMemberPings: number;
}

const initalRegions: RegionData[] = [
  { id: 1, region: '北美', memberPings: 10, nonMemberPings: 20 },
  { id: 2, region: '加拿大', memberPings: 10, nonMemberPings: 20 },
];

const ActionDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="w-[200px] p-2.5 absolute right-0 top-9 bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[10px] flex flex-col z-[100]"
    >
      <div className="px-2.5 h-10 flex items-center cursor-pointer rounded text-text-dark text-sm">查看</div>
      <div className="px-2.5 h-10 flex items-center cursor-pointer rounded text-danger text-sm">刪除</div>
    </div>
  );
};

const RegionTableRow: React.FC<{ region: RegionData; index: number; isMenuOpen: boolean; toggleMenu: () => void; closeMenu: () => void }> = ({ region, index, isMenuOpen, toggleMenu, closeMenu }) => {
  return (
    <div
      className={`flex items-center px-2.5 h-14 hover:bg-hover-row ${
        index % 2 === 0 ? 'bg-white' : 'bg-bg-zebra'
      }`}
    >
      <div className="w-40 px-2.5 text-text-medium text-sm tracking-wide">{region.region}</div>
      <div className="w-40 px-2.5 text-text-medium text-sm tracking-wide">{region.memberPings}</div>
      <div className="flex-1 px-2.5 text-text-medium text-sm tracking-wide">{region.nonMemberPings}</div>
      
      <div className="w-[50px] px-2.5 flex justify-center relative">
        <button
          className="bg-transparent border-none cursor-pointer p-1 flex gap-[3px] items-center"
          onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
        >
          <div className="w-[3px] h-[3px] bg-icon-dark rounded-full" />
          <div className="w-[3px] h-[3px] bg-icon-dark rounded-full" />
          <div className="w-[3px] h-[3px] bg-icon-dark rounded-full" />
        </button>
        <ActionDropdown isOpen={isMenuOpen} onClose={closeMenu} />
      </div>
    </div>
  );
};

const Region: React.FC = () => {
  const [regions] = useState<RegionData[]>(initalRegions);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [total] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<string | null | number>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleToggleMenu = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full py-5 px-7 bg-white font-sans">
      {/* 麵包屑 */}
      <div className="flex items-center gap-2 h-10">
        <span className="text-text-muted text-sm">設定</span>
        <div className="w-1 h-2 border-t border-r border-text-dark rotate-45 mx-1" />
        <span className="text-text-dark text-sm">地區管理</span>
      </div>

      {/* 頁面標題與操作區 */}
      <div className="flex justify-between items-center h-12 mb-2.5">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-text-medium text-2xl font-medium m-0 tracking-wide">地區管理</h1>
          <span className="text-text-light text-base tracking-wide">({total})</span>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 min-w-[88px] px-3 bg-primary text-white border-none rounded text-sm font-medium cursor-pointer tracking-wide flex justify-center items-center"
        >
          新增
        </button>
      </div>

      {/* 資料列表區塊 */}
      <div className="flex flex-col">
        {/* 表頭 */}
        <div className="flex items-center px-2.5 h-[52px] bg-white border-b border-border">
          <div className="w-40 px-2.5 text-text-muted text-sm tracking-wide">地區名稱</div>
          <div className="w-40 px-2.5 text-text-muted text-sm tracking-wide">會員Ping數</div>
          <div className="flex-1 px-2.5 text-text-muted text-sm tracking-wide">非會員Ping數</div>
          <div className="w-[50px] px-2.5 text-text-muted text-sm tracking-wide text-center">操作</div>
        </div>

        {/* 資料列 */}
        <div className="flex flex-col">
          {loading && <div className="py-5 px-2.5 text-text-light text-sm tracking-wide">載入中...</div>}
          {!loading && error && <div className="py-5 px-2.5 text-danger text-sm tracking-wide">{error}</div>}
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