import React, { useState, useRef, useEffect } from 'react';
import { StatCardGrid } from '../components/StatCard';
import type { StatCardData } from '../components/StatCard';
import DashboardFilterPanel from '../components/DashboardFilterPanel';
import type { DashboardFilterValues } from '../components/DashboardFilterPanel';

// ==========================================
// Static Data
// ==========================================

const stats: StatCardData[] = [
  { label: '總用戶數', value: '1,234', change: '+12%', color: '#059669' },
  { label: '總訂單數', value: '567', change: '+8%', color: '#059669' },
  { label: '總營收', value: '$12,345', change: '+23%', color: '#059669' },
  { label: '活躍用戶', value: '890', change: '-3%', color: '#dc2626' },
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

const statusBadgeColor = (status: string): React.CSSProperties => {
  switch (status) {
    case '已完成':
      return { background: '#ECFDF5', color: '#059669' };
    case '處理中':
      return { background: '#FFF8E1', color: '#D97706' };
    case '已出貨':
      return { background: '#EBF5FF', color: '#1383D3' };
    default:
      return { background: '#F5F5F5', color: '#888888' };
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
      style={{
        width: 200,
        padding: 10,
        position: 'absolute',
        right: 0,
        top: 36,
        background: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.10)',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      <div style={{ padding: '0 10px', height: 40, display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: 4, color: '#333333', fontSize: 14 }}>
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
      <div style={{ width: 120, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{order.id}</div>
      <div style={{ width: 120, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{order.customer}</div>
      <div style={{ width: 160, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{order.product}</div>
      <div style={{ width: 120, padding: '0 10px', color: '#454545', fontSize: 14, letterSpacing: 1 }}>{order.amount}</div>
      <div style={{ flex: 1, padding: '0 10px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: '500',
            ...statusBadgeColor(order.status),
          }}
        >
          {order.status}
        </span>
      </div>

      {/* 操作欄位 */}
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
            e.stopPropagation();
            toggleMenu();
          }}
        >
          <div style={{ width: 3, height: 3, background: '#28303F', borderRadius: '50%' }} />
          <div style={{ width: 3, height: 3, background: '#28303F', borderRadius: '50%' }} />
          <div style={{ width: 3, height: 3, background: '#28303F', borderRadius: '50%' }} />
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
    <div style={{ width: '100%', padding: '20px 28px', background: 'white', fontFamily: 'Noto Sans TC, sans-serif' }}>

      {/* 麵包屑 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
        <span style={{ color: '#999999', fontSize: 14 }}>首頁</span>
        <div style={{ width: 4, height: 8, borderTop: '1px solid #333', borderRight: '1px solid #333', transform: 'rotate(45deg)', margin: '0 4px' }} />
        <span style={{ color: '#333333', fontSize: 14 }}>儀表板</span>
      </div>

      {/* 頁面標題與操作區 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 48, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 style={{ color: '#454545', fontSize: 24, fontWeight: '500', margin: 0, letterSpacing: 0.3 }}>儀表板</h1>
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

      {/* 數據卡片區 */}
      <div style={{ marginBottom: 24 }}>
        <StatCardGrid items={stats} />
      </div>

      {/* 最近訂單區塊 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <h2 style={{ color: '#454545', fontSize: 18, fontWeight: '500', margin: 0, letterSpacing: 0.3 }}>最近訂單</h2>
        <span style={{ color: '#888888', fontSize: 14, letterSpacing: 1 }}>({filteredOrders.length})</span>
      </div>

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
          <div style={{ width: 120, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>訂單編號</div>
          <div style={{ width: 120, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>客戶</div>
          <div style={{ width: 160, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>商品</div>
          <div style={{ width: 120, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>金額</div>
          <div style={{ flex: 1, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1 }}>狀態</div>
          <div style={{ width: 50, padding: '0 10px', color: '#999999', fontSize: 14, letterSpacing: 1, textAlign: 'center' }}>操作</div>
        </div>

        {/* 資料列 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
