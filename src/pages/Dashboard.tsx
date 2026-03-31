import React, { useState, useRef, useEffect } from 'react';
import { StatCardGrid } from '../components/StatCard';
import type { StatCardData } from '../components/StatCard';
import DashboardFilterPanel from '../components/DashboardFilterPanel';
import type { DashboardFilterValues } from '../components/DashboardFilterPanel';

// ==========================================
// Static Data
// ==========================================

const stats: StatCardData[] = [
  { label: '總用戶數量', value: '1,234', change: '+12%', color: '#059669', icon: '👤', iconBg: '#1383D2' },
  { label: '總訂單數', value: '567', change: '+8%', color: '#059669', icon: '📋', iconBg: '#1383D2' },
  { label: '總營收', value: '$12,345', change: '+23%', color: '#059669', icon: '💰', iconBg: '#1383D2' },
  { label: '活躍用戶', value: '890', change: '-3%', color: '#dc2626', icon: '🔥', iconBg: '#1383D2' },
];

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: string;
}

const allOrders: Order[] = [
  { id: '#1001', customer: '王小明', product: 'MacBook Pro', amount: '$1,299', status: '已完成' },
  { id: '#1002', customer: '李美麗', product: 'iPhone 15', amount: '$999', status: '處理中' },
  { id: '#1003', customer: '張大偉', product: 'AirPods Pro', amount: '$249', status: '已出貨' },
  { id: '#1004', customer: '陳怡君', product: 'iPad Air', amount: '$599', status: '已完成' },
  { id: '#1005', customer: '林志豪', product: 'Apple Watch', amount: '$399', status: '待處理' },
];

const DEFAULT_FILTERS: DashboardFilterValues = {
  dateRange: '',
  orderStatus: '',
  category: '',
};

// ==========================================
// Helper
// ==========================================

const statusBadgeClass = (status: string): string => {
  switch (status) {
    case '已完成': return 'bg-success-light text-success';
    case '處理中': return 'bg-warning-light text-warning';
    case '已出貨': return 'bg-primary-light text-primary';
    default:      return 'bg-bg-zebra text-text-light';
  }
};

// ==========================================
// Order Row Component
// ==========================================

const OrderActionDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
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
      <div className="px-2.5 h-10 flex items-center cursor-pointer rounded text-text-dark text-sm">
        查看
      </div>
    </div>
  );
};

const OrderTableRow: React.FC<{
  order: Order;
  index: number;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}> = ({ order, index, isMenuOpen, toggleMenu, closeMenu }) => {
  return (
    <div
      className={`flex items-center px-2.5 h-14 hover:bg-[#E0E0E0] ${
        index % 2 === 0 ? 'bg-white' : 'bg-bg-zebra'
      }`}
    >
      <div className="w-[120px] px-2.5 text-text-medium text-sm tracking-wide">{order.id}</div>
      <div className="w-[120px] px-2.5 text-text-medium text-sm tracking-wide">{order.customer}</div>
      <div className="w-40 px-2.5 text-text-medium text-sm tracking-wide">{order.product}</div>
      <div className="w-[120px] px-2.5 text-text-medium text-sm tracking-wide">{order.amount}</div>
      <div className="flex-1 px-2.5">
        <span className={`inline-block px-3 py-1 rounded-full text-[13px] font-medium ${statusBadgeClass(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[50px] px-2.5 flex justify-center relative">
        <button
          className="bg-transparent border-none cursor-pointer p-1 flex gap-[3px] items-center"
          onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
        >
          <div className="w-[3px] h-[3px] bg-[#28303F] rounded-full" />
          <div className="w-[3px] h-[3px] bg-[#28303F] rounded-full" />
          <div className="w-[3px] h-[3px] bg-[#28303F] rounded-full" />
        </button>
        <OrderActionDropdown isOpen={isMenuOpen} onClose={closeMenu} />
      </div>
    </div>
  );
};

// ==========================================
// Main Page Component
// ==========================================

const Dashboard: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<DashboardFilterValues>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilterValues>(DEFAULT_FILTERS);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(allOrders);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const applyFilters = (filters: DashboardFilterValues): Order[] => {
    return allOrders.filter((order) => {
      const matchStatus =
        filters.orderStatus === '' ||
        (filters.orderStatus === 'completed' && order.status === '已完成') ||
        (filters.orderStatus === 'processing' && order.status === '處理中') ||
        (filters.orderStatus === 'shipped' && order.status === '已出貨') ||
        (filters.orderStatus === 'pending' && order.status === '待處理');
      return matchStatus;
    });
  };

  const activeFilterCount = [
    appliedFilters.dateRange !== '',
    appliedFilters.orderStatus !== '',
    appliedFilters.category !== '',
  ].filter(Boolean).length;

  const handleToggleMenu = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full py-5 px-7 bg-white font-sans">
      {/* 麵包屑 */}
      <div className="flex items-center gap-2 h-10">
        <span className="text-text-muted text-sm">首頁</span>
        <div className="w-1 h-2 border-t border-r border-[#333] rotate-45 mx-1" />
        <span className="text-text-dark text-sm">儀表板</span>
      </div>

      {/* 頁面標題與操作區 */}
      <div className="flex justify-between items-center h-12 mb-2.5">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-text-medium text-2xl font-medium m-0 tracking-wide">儀表板</h1>
        </div>

        {/* 篩選按鈕 */}
        <button
          onClick={() => { setPendingFilters(appliedFilters); setIsFilterOpen(true); }}
          className={`h-10 min-w-[88px] px-3 rounded text-sm font-medium cursor-pointer tracking-wide flex justify-center items-center gap-1.5 ${
            activeFilterCount > 0
              ? 'bg-primary-light text-primary border border-primary'
              : 'bg-white text-text-dark border border-text-dark'
          }`}
        >
          篩選
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white rounded-full w-[18px] h-[18px] text-[11px] flex items-center justify-center font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 數據卡片區 */}
      <div className="mb-6">
        <StatCardGrid items={stats} />
      </div>

      {/* 最近訂單標題 */}
      <div className="flex items-baseline gap-2.5 mb-3">
        <h2 className="text-text-medium text-lg font-medium m-0 tracking-wide">最近訂單</h2>
        <span className="text-text-light text-sm tracking-wide">({filteredOrders.length})</span>
      </div>

      {/* 表格 */}
      <div className="flex flex-col">
        {/* 表頭 */}
        <div className="flex items-center px-2.5 h-[52px] bg-white border-b border-border">
          <div className="w-[120px] px-2.5 text-text-muted text-sm tracking-wide">訂單編號</div>
          <div className="w-[120px] px-2.5 text-text-muted text-sm tracking-wide">客戶</div>
          <div className="w-40 px-2.5 text-text-muted text-sm tracking-wide">商品</div>
          <div className="w-[120px] px-2.5 text-text-muted text-sm tracking-wide">金額</div>
          <div className="flex-1 px-2.5 text-text-muted text-sm tracking-wide">狀態</div>
          <div className="w-[50px] px-2.5 text-text-muted text-sm tracking-wide text-center">操作</div>
        </div>

        {/* 資料列 */}
        <div className="flex flex-col">
          {filteredOrders.map((order, index) => (
            <OrderTableRow
              key={order.id}
              order={order}
              index={index}
              isMenuOpen={openDropdownId === order.id}
              toggleMenu={() => handleToggleMenu(order.id)}
              closeMenu={() => setOpenDropdownId(null)}
            />
          ))}
        </div>
      </div>

      {/* 篩選面板 */}
      <DashboardFilterPanel
        isOpen={isFilterOpen}
        values={pendingFilters}
        onChange={setPendingFilters}
        onApply={() => {
          setAppliedFilters(pendingFilters);
          setFilteredOrders(applyFilters(pendingFilters));
          setIsFilterOpen(false);
        }}
        onReset={() => {
          setPendingFilters(DEFAULT_FILTERS);
          setAppliedFilters(DEFAULT_FILTERS);
          setFilteredOrders(allOrders);
        }}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
