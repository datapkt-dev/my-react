import React from 'react';

// ==========================================
// Types
// ==========================================

export interface StatCardData {
  label: string;
  value: string;
  change: string;
  color: string;
  icon?: string;
}

interface StatCardProps {
  data: StatCardData;
}

// ==========================================
// StatCard Component
// ==========================================

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const isPositive = data.change.startsWith('+');

  return (
    <div
      style={{
        flex: 1,
        minWidth: 200,
        padding: 20,
        background: 'white',
        borderRadius: 10,
        border: '1px solid #EDEDED',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* 標籤 */}
      <span style={{ fontSize: 14, color: '#888888', letterSpacing: 0.5 }}>
        {data.label}
      </span>

      {/* 數值 */}
      <span style={{ fontSize: 28, fontWeight: '600', color: '#333333', letterSpacing: 0.5 }}>
        {data.value}
      </span>

      {/* 變動百分比 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: data.color,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {isPositive ? '▲' : '▼'} {data.change}
        </span>
        <span style={{ fontSize: 12, color: '#AAAAAA' }}>vs 上月</span>
      </div>
    </div>
  );
};

// ==========================================
// StatCardGrid – 一次渲染多張卡片
// ==========================================

interface StatCardGridProps {
  items: StatCardData[];
}

export const StatCardGrid: React.FC<StatCardGridProps> = ({ items }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      {items.map((item) => (
        <StatCard key={item.label} data={item} />
      ))}
    </div>
  );
};

export default StatCard;
