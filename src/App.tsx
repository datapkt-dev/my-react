import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { logout } from './shared/api/authApi'
import SideMenu from './shared/components/layout/SideMenu'
import TopBar from './shared/components/layout/TopBar'
import Login from './pages/Login'
import { DashboardPage } from './features/dashboard'
import { UserListPage, UserDetailPage, SuspendedUsersPage, ReportListPage } from './features/users'
import { StaffsPage } from './features/staffs'
import { RegionPage } from './features/settings'
import { UserAnalyticsPage, PostAnalyticsPage } from './features/analysis'
import { NotificationManagementPage } from './features/notifications'
import './App.css'

/**
 * 受保護的路由：如果沒有 access_token 就導向登入頁
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

/**
 * 後台版面配置：SideMenu + TopBar + Outlet
 */
function AppLayout() {
  const navigate = useNavigate()

  const staffRaw = localStorage.getItem('staff')
  const staff = staffRaw ? JSON.parse(staffRaw) : null
  const userName = staff?.name || 'Admin'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu />
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <TopBar user={{ name: userName }} hasUnreadNotification onLogout={handleLogout} />
        <main className="flex-1 flex flex-col min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登入頁 */}
        <Route path="/login" element={<Login />} />

        {/* 受保護的後台路由 */}
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<Outlet />} >
            <Route path="userList" element={<UserListPage />} />
            <Route path="/users/userList/:id" element={<UserDetailPage />} />
            <Route path="suspendedList" element={<SuspendedUsersPage />} />
            <Route path="reportList" element={<ReportListPage />} />
          </Route>
          <Route path="/staffs" element={<StaffsPage />} />
          <Route path="/region" element={<RegionPage />} />
          <Route path="/analysis" element={<Outlet />}>
            <Route path="users" element={<UserAnalyticsPage />} />
            <Route path="posts" element={<PostAnalyticsPage />} />
          </Route>
          <Route path="/notifications" element={<NotificationManagementPage />} />
          <Route path="/settings" element={<Outlet />}> 
            {/* 當使用者進入 /settings 時，自動跳轉到地區管理 */}
            <Route index element={<Navigate to="region" replace />} />
            <Route path="region" element={<RegionPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
