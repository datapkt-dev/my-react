import React from 'react';
import type { Notification } from '../types/notification';

// ==========================================
// Types
// ==========================================

interface NotificationTableProps {
  data: Notification[];
}

// ==========================================
// Column Definitions
// ==========================================

const COLUMNS = [
  { key: 'title', label: '標題', width: 'w-40' },
  { key: 'publishTime', label: '時間', width: 'w-40' },
  { key: 'targetAudience', label: '發佈對象', width: 'w-40' },
  { key: 'content', label: '發佈內容', width: 'flex-1' },
];

// ==========================================
// Table Header Component
// ==========================================

const TableHeader: React.FC = () => (
  <div className="flex items-center bg-white border-b border-border px-2.5 h-[52px]">
    {COLUMNS.map((col) => (
      <div
        key={col.key}
        className={`flex items-center px-2.5 text-sm text-text-muted tracking-wide whitespace-nowrap ${col.width}`}
      >
        {col.label}
      </div>
    ))}
  </div>
);

// ==========================================
// Table Row Component
// ==========================================

const TableRow: React.FC<{ item: Notification; isZebra: boolean }> = ({ item, isZebra }) => (
  <div className={`flex items-center px-2.5 h-14 ${isZebra ? 'bg-bg-zebra' : 'bg-white'}`}>
    <div className="w-40 px-2.5 text-text-medium text-sm tracking-wide">{item.title}</div>
    <div className="w-40 px-2.5 text-text-medium text-sm tracking-wide">{item.publishTime}</div>
    <div className="w-40 px-2.5 text-text-medium text-sm tracking-wide">{item.targetAudience}</div>
    <div className="flex-1 px-2.5 text-text-medium text-sm tracking-wide truncate">{item.content}</div>
  </div>
);

// ==========================================
// Main Table Component
// ==========================================

const NotificationTable: React.FC<NotificationTableProps> = ({ data }) => {
  return (
    <div className="flex flex-col w-full">
      <TableHeader />
      <div className="flex flex-col">
        {data.length === 0 ? (
          <div className="py-5 px-2.5 text-text-light text-sm tracking-wide">暫無通知資料</div>
        ) : (
          data.map((item, idx) => (
            <TableRow key={item.id} item={item} isZebra={idx % 2 === 1} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationTable;
