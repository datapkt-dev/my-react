const stats = [
  { label: '總用戶數', value: '1,234', change: '+12%', color: '#4f46e5' },
  { label: '總訂單數', value: '567', change: '+8%', color: '#059669' },
  { label: '總營收', value: '$12,345', change: '+23%', color: '#d97706' },
  { label: '活躍用戶', value: '890', change: '-3%', color: '#dc2626' },
]

const recentOrders = [
  { id: '#1001', customer: '王小明', product: 'MacBook Pro', amount: '$1,299', status: '已完成' },
  { id: '#1002', customer: '李美麗', product: 'iPhone 15', amount: '$999', status: '處理中' },
  { id: '#1003', customer: '張大偉', product: 'AirPods Pro', amount: '$249', status: '已出貨' },
  { id: '#1004', customer: '陳怡君', product: 'iPad Air', amount: '$599', status: '已完成' },
  { id: '#1005', customer: '林志豪', product: 'Apple Watch', amount: '$399', status: '待處理' },
]

function Dashboard() {
  return (
    <div>
      <h1 className="page-title">儀表板</h1>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change" style={{ color: stat.color }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2 className="card-title">最近訂單</h2>
        <table className="table">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>客戶</th>
              <th>商品</th>
              <th>金額</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`badge badge-${order.status === '已完成' ? 'success' : order.status === '處理中' ? 'warning' : order.status === '已出貨' ? 'info' : 'default'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
