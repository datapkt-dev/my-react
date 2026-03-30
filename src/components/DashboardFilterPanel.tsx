import React, { useEffect } from 'react';

// ==========================================
// Types
// ==========================================

export interface DashboardFilterValues {
  dateRange: string;
  orderStatus: string;
  category: string;
}

interface DashboardFilterPanelProps {
  isOpen: boolean;
  values: DashboardFilterValues;
  onChange: (values: DashboardFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

// ==========================================
// Styles
// ==========================================

const inputStyleSelect: React.CSSProperties = {
  height: 40,
  padding: '0 12px',
  border: '1px solid #D1D5DB',
  borderRadius: 6,
  fontSize: 16,
  color: '#1e293b',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
};

// ==========================================
// Component
// ==========================================

const DashboardFilterPanel: React.FC<DashboardFilterPanelProps> = ({
  isOpen,
  values,
  onChange,
  onApply,
  onReset,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Slide-out panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 320,
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          fontFamily: 'Noto Sans TC, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: '600', color: '#1e293b', letterSpacing: 0.5 }}>
            篩選
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: 20,
              lineHeight: 1,
            }}
            aria-label="關閉篩選面板"
          >
            ✕
          </button>
        </div>

        {/* Filter fields */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Date Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              時間範圍
            </label>
            <select
              style={inputStyleSelect}
              onChange={(e) => onChange({ ...values, dateRange: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = '#1383D3')}
              onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
              value={values.dateRange}
            >
              <option value="">全部</option>
              <option value="today">今天</option>
              <option value="7days">近 7 天</option>
              <option value="30days">近 30 天</option>
              <option value="90days">近 90 天</option>
              <option value="thisYear">今年</option>
            </select>
          </div>

          {/* Order Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              訂單狀態
            </label>
            <select
              style={inputStyleSelect}
              onChange={(e) => onChange({ ...values, orderStatus: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = '#1383D3')}
              onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
              value={values.orderStatus}
            >
              <option value="">全部</option>
              <option value="completed">已完成</option>
              <option value="processing">處理中</option>
              <option value="shipped">已出貨</option>
              <option value="pending">待處理</option>
            </select>
          </div>

          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              商品分類
            </label>
            <select
              style={inputStyleSelect}
              onChange={(e) => onChange({ ...values, category: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = '#1383D3')}
              onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
              value={values.category}
            >
              <option value="">全部</option>
              <option value="electronics">電子產品</option>
              <option value="accessories">配件</option>
              <option value="wearables">穿戴裝置</option>
            </select>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              paddingTop: 16,
            }}
          >
            <button
              onClick={onReset}
              style={{
                flex: 1,
                height: 40,
                border: '1px solid #D1D5DB',
                borderRadius: 6,
                background: 'white',
                color: '#374151',
                fontSize: 14,
                fontWeight: '500',
                cursor: 'pointer',
                letterSpacing: 0.5,
                fontFamily: 'Noto Sans TC, sans-serif',
              }}
            >
              清除重選
            </button>
            <button
              onClick={onApply}
              style={{
                flex: 1,
                height: 40,
                border: 'none',
                borderRadius: 6,
                background: '#1383D3',
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
                cursor: 'pointer',
                letterSpacing: 0.5,
                fontFamily: 'Noto Sans TC, sans-serif',
              }}
            >
              查詢
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardFilterPanel;
