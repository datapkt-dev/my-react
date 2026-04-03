import { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import NexlyStyleTable from '../components/NexlyStyleTable';
import type { NexlyColumnDef } from '../components/NexlyStyleTable';

// ==========================================
// Types
// ==========================================

interface MockUser {
  id: number;
  account: string;
  country: string;
  city: string;
  name: string;
  birthday: string;
  email: string;
  phone: string;
}

// ==========================================
// Mock Data Generator
// ==========================================

const COUNTRIES = ['台灣', '日本', '韓國', '美國', '英國', '澳洲', '新加坡', '馬來西亞', '泰國', '越南'];
const CITIES: Record<string, string[]> = {
  '台灣': ['台北', '台中', '高雄', '新竹', '台南'],
  '日本': ['東京', '大阪', '京都', '名古屋', '福岡'],
  '韓國': ['首爾', '釜山', '仁川', '大邱'],
  '美國': ['紐約', '洛杉磯', '芝加哥', '舊金山'],
  '英國': ['倫敦', '曼徹斯特', '利物浦'],
  '澳洲': ['雪梨', '墨爾本', '布里斯班'],
  '新加坡': ['新加坡'],
  '馬來西亞': ['吉隆坡', '檳城'],
  '泰國': ['曼谷', '清邁'],
  '越南': ['胡志明市', '河內'],
};
const LAST_NAMES = ['王', '李', '張', '劉', '陳', '楊', '黃', '趙', '吳', '周', '林', '許', '鄭', '謝', '蔡'];
const FIRST_NAMES = ['小明', '小華', '志偉', '美玲', '家豪', '淑芬', '俊傑', '雅婷', '建宏', '怡君', '宗翰', '詩涵', '冠廷', '佳蓉', '承翰'];

function generateMockUsers(count: number): MockUser[] {
  const users: MockUser[] = [];
  for (let i = 1; i <= count; i++) {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const cityList = CITIES[country] || ['未知'];
    const city = cityList[Math.floor(Math.random() * cityList.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const year = 1970 + Math.floor(Math.random() * 35);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    users.push({
      id: i,
      account: `user${String(i).padStart(4, '0')}@example.com`,
      country,
      city,
      name: `${lastName}${firstName}`,
      birthday: `${year}-${month}-${day}`,
      email: `user${String(i).padStart(4, '0')}@example.com`,
      phone: `09${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    });
  }
  return users;
}

// 預先產生 87 筆 mock 資料
const ALL_MOCK_USERS = generateMockUsers(87);

// ==========================================
// 模擬 API 呼叫（模擬 nexly-web 的 GetCustomers）
// ==========================================

interface ApiResponse {
  total: number;
  items: MockUser[];
}

function fakeFetchUsers(page: number, pageSize: number): Promise<ApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const items = ALL_MOCK_USERS.slice(start, end);
      resolve({
        total: ALL_MOCK_USERS.length,
        items,
      });
    }, 300); // 模擬 300ms 網路延遲
  });
}

// ==========================================
// Table Columns
// ==========================================

const USER_COLUMNS: NexlyColumnDef<MockUser>[] = [
  { key: 'id', label: '會員ID', width: 80 },
  { key: 'account', label: '會員帳號', width: 220 },
  {
    key: 'country',
    label: '國籍城市',
    width: 140,
    render: (item) => <>{item.country} / {item.city}</>,
  },
  { key: 'name', label: '姓名', width: 120 },
  { key: 'phone', label: '手機', width: 140 },
  { key: 'email', label: '信箱', width: 220 },
  { key: 'birthday', label: '生日', width: 120 },
];

// ==========================================
// TestDemo Page Component
// ==========================================

const TestDemo: React.FC = () => {
  // 分頁狀態（模擬 nexly-web 的 API 分頁模式）
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(false);

  // 資料載入（模擬 nexly-web 的 initialData）
  const loadData = useCallback(() => {
    setLoading(true);
    fakeFetchUsers(page, pageSize)
      .then((res) => {
        setTotalItems(res.total);
        setItems(res.items);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  // 監聽 page / pageSize 變化自動重新載入（模擬 nexly-web 的 watch）
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <PageContainer>
      <PageHeader title="使用者列表" count={totalItems} breadcrumbs={<Breadcrumbs size="sm" />} />

      <NexlyStyleTable<MockUser>
        data={items}
        columns={USER_COLUMNS}
        rowKey={(item) => item.id}
        actions={[
          { label: '查看', onClick: (item) => alert(`查看使用者 #${item.id}: ${item.name}`) },
        ]}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={loading}
      />
    </PageContainer>
  );
};

export default TestDemo;
