import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchBannedUserList } from '../api/userApi'
import FilterPanel, { type FilterValues } from '../components/FilterPanel'
import PageContainer from '../components/PageContainer'
import PageHeader from '../components/PageHeader'
import Breadcrumbs from '../components/Breadcrumbs'
import DataTable from '../components/DataTable'
import type { ColumnDef } from '../components/DataTable'

// ==========================================
// Types & Interfaces
// ==========================================

interface User {
  id: number
  name: string
  email?: string
  nationality: string
  birthday: string
  membershipType?: string
  isBanned?: boolean
  joinDate?: string
  avatar_url?: string
}

const DEFAULT_FILTERS: FilterValues = {
  account: '',
  nationality: '',
  name: '',
  city: '',
  birthday: '',
};

// ==========================================
// Reusable Components
// ==========================================

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SUSPENDED_USER_COLUMNS: ColumnDef<User>[] = [
  { key: 'name', label: '會員帳號', width: 'w-40' },
  { key: 'nationality', label: '國籍城市', width: 'w-[100px]' },
  { key: 'name', label: '姓名', width: 'w-40' },
  {
    key: 'birthday',
    label: '生日',
    render: (item) => <>{formatDate(item.birthday)}</>,
  },
];

// ==========================================
// Main Page Component
// ==========================================

const SuspendedUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([])
  const [filterRole, setFilterRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  const applyFilters = (list: User[], filters: FilterValues): User[] => {
    return list.filter((user) => {
      const matchAccount =
        filters.account === '' ||
        user.name?.toLowerCase().includes(filters.account?.toLowerCase());
      const matchNationality =
        filters.nationality === '' ||
        user.nationality?.toLowerCase().includes(filters.nationality?.toLowerCase());
      const matchName =
        filters.name === '' ||
        user.name?.toLowerCase().includes(filters.name?.toLowerCase());
      const matchBirthday =
        filters.birthday === '' ||
        user.birthday?.toLowerCase().includes(filters.birthday?.toLowerCase());
      return matchAccount && matchNationality && matchName && matchBirthday;
    });
  };

  useEffect(() => {
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    if (!projectId) {
      setError('無法取得專案 ID，請重新登入');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchBannedUserList(projectId)
      .then((res) => {
        const mapped = res.data.items.map((s) => ({
          id: s.id,
          name: s.name,
          birthday: s.birthday,
          nationality: s.country,
          email: s.email,
          membershipType: s.membership_type,
          isBanned: s.is_banned,
          avatar_url: s.avatar_url,
        }));
        setUsers(mapped);
        setTotal(res.data.total);
        setFilteredUsers(applyFilters(mapped, DEFAULT_FILTERS));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  const activeFilterCount = [
    appliedFilters.account !== '',
    appliedFilters.nationality !== '',
    appliedFilters.city !== '',
    appliedFilters.name !== '',
    appliedFilters.birthday !== '',
  ].filter(Boolean).length;

  return (
    <PageContainer>
      <PageHeader
        title="停權使用者列表"
        count={total}
        actions={
          <button
            onClick={() => { setPendingFilters(appliedFilters); setIsFilterOpen(true); }}
            className={`h-10 min-w-[88px] px-3 rounded text-sm font-medium cursor-pointer tracking-wide flex justify-center items-center gap-1.5 border ${
              activeFilterCount > 0
                ? 'bg-primary-light text-primary border-primary'
                : 'bg-white text-text-dark border-text-dark'
            }`}
          >
            篩選
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white rounded-full w-[18px] h-[18px] text-[11px] flex items-center justify-center font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        }
        breadcrumbs={<Breadcrumbs size="sm" />}
      />

      <DataTable<User>
        data={filteredUsers}
        columns={SUSPENDED_USER_COLUMNS}
        rowKey={(item) => item.id}
        actions={[
          { label: '查看', onClick: (item) => navigate(`/users/userList/${item.id}`) },
        ]}
        loading={loading}
        error={error}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        values={pendingFilters}
        onChange={setPendingFilters}
        onApply={() => {
          setAppliedFilters(pendingFilters);
          setFilteredUsers(applyFilters(users, pendingFilters));
          setIsFilterOpen(false);
        }}
        onReset={() => {
          setPendingFilters(DEFAULT_FILTERS);
          setAppliedFilters(DEFAULT_FILTERS);
          setFilteredUsers(applyFilters(users, DEFAULT_FILTERS));
        }}
        onClose={() => setIsFilterOpen(false)}
        filterValue={filterRole}
        setFilterValue={() => setFilterRole}
      />
    </PageContainer>
  );
};

export default SuspendedUsers;
