import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Staffs from './pages/Staffs'
import Products from './pages/Products'
import Region from './pages/Region'
import Settings from './pages/Settings'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登入頁（不含 Layout） */}
        <Route path="/login" element={<Login />} />

        {/* 受保護的後台路由 */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Outlet />} >
            <Route path="userList" element={<Users />} />
          </Route>
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/region" element={<Region />} />
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
