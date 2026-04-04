import React from 'react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import PageContainer from '../../../shared/components/layout/PageContainer';
import PageHeader from '../../../shared/components/layout/PageHeader';

// Icons
import statUsersIcon from '../../../assets/icons/stat-users.svg';
import statPostsIcon from '../../../assets/icons/stat-posts.svg';
import statCommentsIcon from '../../../assets/icons/stat-comments.svg';

// ==========================================
// Register Chart.js modules
// ==========================================

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// ==========================================
// Types
// ==========================================

interface StatCard {
  label: string;
  value: string;
  icon: string;
  /** flex 倍數（預設 1） */
  flex?: number;
  /** 若為男女人數，分成兩組顯示 */
  subValues?: { label: string; value: string }[];
}

// ==========================================
// Mock Data (與 Vue nexly-web 完全一致)
// ==========================================

const row1Cards: StatCard[] = [
  { label: '總用戶數量', value: '1234', icon: statUsersIcon },
  { label: '總貼文數量', value: '1234', icon: statPostsIcon },
  { label: '總留言數量', value: '1234', icon: statCommentsIcon },
  { label: '總按讚數量', value: '1234', icon: statUsersIcon },
];

const row2Cards: StatCard[] = [
  { label: '一個月以上未上線人數', value: '1234', icon: statUsersIcon },
  { label: '總用戶數量', value: '1234', icon: statUsersIcon },
  {
    label: '男女人數',
    value: '',
    icon: statUsersIcon,
    flex: 2,
    subValues: [
      { label: '男', value: '1234' },
      { label: '女', value: '1234' },
    ],
  },
];

const chartData = {
  labels: ['25歲以下', '25~34', '34~49', '50以上'],
  datasets: [
    {
      data: [2400, 2600, 1600, 1300],
      backgroundColor: ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1000 },
      grid: { display: false },
    },
    x: {
      grid: { display: false },
    },
  },
};

// ==========================================
// DashboardCard — 仿 nexly-web .card-box
// ==========================================

const DashboardCard: React.FC<{ card: StatCard }> = ({ card }) => (
  <div
    style={{
      flex: card.flex ?? 1,
      padding: '0 10px',
    }}
  >
    <div
      style={{
        borderRadius: 10,
        background: 'var(--color-white)',
        boxShadow: '0 0 6px 0 rgba(0,0,0,0.1)',
        padding: 10,
      }}
    >
      {/* 標題列 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--color-text-dark)',
            fontFamily: '"Noto Sans TC"',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '16.8px',
          }}
        >
          {card.label}
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(19,131,211,0.05)',
            borderRadius: 5,
          }}
        >
          <img src={card.icon} alt="" style={{ width: 20, height: 20 }} />
        </div>
      </div>

      {/* 數值列 */}
      {card.subValues ? (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {card.subValues.map((sv) => (
            <div
              key={sv.label}
              style={{
                color: 'var(--color-text-dark)',
                fontFamily: '"Noto Sans TC"',
                fontSize: 30,
                fontWeight: 500,
                lineHeight: '40px',
              }}
            >
              {sv.label}：{sv.value}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            color: 'var(--color-text-dark)',
            fontFamily: '"Noto Sans TC"',
            fontSize: 30,
            fontWeight: 500,
            lineHeight: '40px',
          }}
        >
          {card.value}
        </div>
      )}
    </div>
  </div>
);

// ==========================================
// Dashboard Page (仿 Vue nexly-web dashboard.vue)
// ==========================================

const DashboardPage: React.FC = () => {
  return (
    <PageContainer>
      {/* 頁面標題 + 篩選 */}
      <PageHeader title="Dashboard" showFilter onFilterClick={() => {}} />

      {/* 卡片與圖表區 */}
      <div className="flex flex-col" style={{ width: '100%', gap: 20 }}>
        {/* 第一列：4 張卡片 */}
        <div className="flex" style={{ margin: '0 -10px' }}>
          {row1Cards.map((card, idx) => (
            <DashboardCard key={idx} card={card} />
          ))}
        </div>

        {/* 第二列：3 張卡片（最後一張 flex:2） */}
        <div className="flex" style={{ margin: '0 -10px' }}>
          {row2Cards.map((card, idx) => (
            <DashboardCard key={idx} card={card} />
          ))}
        </div>

        {/* 第三列：年齡分布長條圖 */}
        <div className="flex" style={{ margin: '0 -10px' }}>
          <div style={{ flex: 1, padding: '0 10px' }}>
            <div
              style={{
                borderRadius: 10,
                background: 'var(--color-white)',
                boxShadow: '0 0 6px 0 rgba(0,0,0,0.1)',
                padding: 10,
              }}
            >
              <div
                style={{
                  color: 'var(--color-text-dark)',
                  fontFamily: '"Noto Sans TC"',
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: '16.8px',
                }}
              >
                年齡分布
              </div>
              <div style={{ padding: '16px 0 0 0', height: 300 }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
