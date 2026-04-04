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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/20 z-[200] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-white shadow-[-4px_0_20px_rgba(0,0,0,0.12)] z-[201] flex flex-col font-sans transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-xl font-semibold text-slate-800 tracking-wide">篩選</span>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-gray-500 text-xl leading-none"
            aria-label="關閉篩選面板"
          >
            ✕
          </button>
        </div>

        {/* Filter fields */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          {/* Date Range */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">時間範圍</label>
            <select
              className="h-10 px-3 border border-gray-300 rounded-md text-base text-slate-800 outline-none w-full focus:border-primary"
              onChange={(e) => onChange({ ...values, dateRange: e.target.value })}
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">訂單狀態</label>
            <select
              className="h-10 px-3 border border-gray-300 rounded-md text-base text-slate-800 outline-none w-full focus:border-primary"
              onChange={(e) => onChange({ ...values, orderStatus: e.target.value })}
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">商品分類</label>
            <select
              className="h-10 px-3 border border-gray-300 rounded-md text-base text-slate-800 outline-none w-full focus:border-primary"
              onChange={(e) => onChange({ ...values, category: e.target.value })}
              value={values.category}
            >
              <option value="">全部</option>
              <option value="electronics">電子產品</option>
              <option value="accessories">配件</option>
              <option value="wearables">穿戴裝置</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onReset}
              className="flex-1 h-10 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium cursor-pointer tracking-wide font-sans"
            >
              清除重選
            </button>
            <button
              onClick={onApply}
              className="flex-1 h-10 border-none rounded-md bg-primary text-white text-sm font-medium cursor-pointer tracking-wide font-sans"
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
