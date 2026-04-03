import type React from 'react';

// ==========================================
// Types
// ==========================================

export interface StatCardData {
  label: string;
  value: string;
  change: string;
  color: string;
  /** 圖標佔位符文字 (emoji / 字元) */
  icon?: string;
  /** 圖標背景色，預設 primary */
  iconBg?: string;
}

interface StatCardProps {
  data: StatCardData;
}

// ==========================================
// StatCard Component
// 依 Figma: VERTICAL / gap-20 / p-16 / white bg / shadow
// ==========================================

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  return (
    <div className="flex-1 min-w-[200px] flex flex-col items-center gap-5 p-4 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* content 區塊: VERTICAL / gap-10 / FILL width */}
      <div className="w-full flex flex-col gap-2.5">
        {/* title + icon 列: HORIZONTAL / SPACE_BETWEEN / CENTER */}
        <div className="w-full flex items-center justify-between gap-2.5">
          <span className="text-sm text-text-dark tracking-wide">
            {data.label}
          </span>
          {/* icon 容器: bg-primary / p-5 / FIXED / rounded */}
          <div
            className="w-14 h-14 flex items-center justify-center rounded-lg shrink-0"
            style={{ backgroundColor: data.iconBg || 'var(--color-primary)' }}
          >
            <span className="text-white text-xl">{data.icon || '📊'}</span>
          </div>
        </div>

        {/* count 列: HORIZONTAL / CENTER cross / gap-10 / FILL width */}
        <div className="w-full flex items-center gap-2.5">
          <span className="text-[28px] font-semibold text-text-dark tracking-wide">
            {data.value}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// StatCardGrid
// ==========================================

interface StatCardGridProps {
  items: StatCardData[];
}

export const StatCardGrid: React.FC<StatCardGridProps> = ({ items }) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {items.map((item) => (
        <StatCard key={item.label} data={item} />
      ))}
    </div>
  );
};

export default StatCard;
