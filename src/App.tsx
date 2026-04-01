import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { logout } from './api/authApi'
import SideMenu from './components/SideMenu'
import TopBar from './components/TopBar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Staffs from './pages/Staffs'
import Products from './pages/Products'
import Region from './pages/Region'
import UserDetail from './pages/UserDetail'
import SuspendedUsers from './pages/SuspendedUsers'
import ReportList from './pages/ReportList'
import UserAnalytics from './pages/UserAnalytics'
import PostAnalytics from './pages/PostAnalytics'
import NotificationManagement from './pages/NotificationManagement'
import Settings from './pages/Settings'
import TestDemo from './pages/TestDemo'
import UserDetailDemo from './pages/UserDetailDemo'
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Outlet />} >
            <Route path="userList" element={<Users />} />
            <Route path="/users/userList/:id" element={<UserDetail />} />
            <Route path="suspendedList" element={<SuspendedUsers />} />
            <Route path="reportList" element={<ReportList />} />
          </Route>
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/region" element={<Region />} />
          <Route path="/analysis" element={<Outlet />}>
            <Route path="users" element={<UserAnalytics />} />
            <Route path="posts" element={<PostAnalytics />} />
          </Route>
          <Route path="/test-demo" element={<TestDemo />} />
          <Route path="/user-detail-demo" element={<UserDetailDemo />} />
          <Route path="/notifications" element={<NotificationManagement />} />
          <Route path="/settings" element={<Outlet />}> 
            {/* 當使用者進入 /settings 時，自動跳轉到地區管理 */}
            <Route index element={<Navigate to="region" replace />} />
            <Route path="region" element={<Region />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
