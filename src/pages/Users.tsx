import { useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: '啟用' | '停用'
  joinDate: string
}

const initialUsers: User[] = [
  { id: 1, name: '王小明', email: 'wang@example.com', role: '管理員', status: '啟用', joinDate: '2025-01-15' },
  { id: 2, name: '李美麗', email: 'li@example.com', role: '編輯', status: '啟用', joinDate: '2025-02-20' },
  { id: 3, name: '張大偉', email: 'zhang@example.com', role: '使用者', status: '停用', joinDate: '2025-03-10' },
  { id: 4, name: '陳怡君', email: 'chen@example.com', role: '使用者', status: '啟用', joinDate: '2025-04-05' },
  { id: 5, name: '林志豪', email: 'lin@example.com', role: '編輯', status: '啟用', joinDate: '2025-05-12' },
  { id: 6, name: '黃淑芬', email: 'huang@example.com', role: '使用者', status: '停用', joinDate: '2025-06-18' },
]

function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(
    (u) => u.name.includes(search) || u.email.includes(search)
  )

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === '啟用' ? '停用' : '啟用' } : u
      )
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">用戶管理</h1>
        <button className="btn btn-primary">+ 新增用戶</button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜尋用戶名稱或 Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名稱</th>
              <th>Email</th>
              <th>角色</th>
              <th>狀態</th>
              <th>加入日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className="badge badge-info">{user.role}</span></td>
                <td>
                  <span className={`badge ${user.status === '啟用' ? 'badge-success' : 'badge-default'}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joinDate}</td>
                <td>
                  <button className="btn btn-sm" onClick={() => toggleStatus(user.id)}>
                    {user.status === '啟用' ? '停用' : '啟用'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
