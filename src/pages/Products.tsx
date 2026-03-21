import { useState } from 'react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: '上架' | '下架'
}

const initialProducts: Product[] = [
  { id: 1, name: 'MacBook Pro 14"', category: '筆電', price: 1299, stock: 45, status: '上架' },
  { id: 2, name: 'iPhone 15 Pro', category: '手機', price: 999, stock: 120, status: '上架' },
  { id: 3, name: 'AirPods Pro 2', category: '配件', price: 249, stock: 200, status: '上架' },
  { id: 4, name: 'iPad Air M2', category: '平板', price: 599, stock: 0, status: '下架' },
  { id: 5, name: 'Apple Watch Ultra', category: '穿戴裝置', price: 799, stock: 30, status: '上架' },
  { id: 6, name: 'Magic Keyboard', category: '配件', price: 299, stock: 85, status: '上架' },
]

function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(
    (p) => p.name.includes(search) || p.category.includes(search)
  )

  const toggleStatus = (id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === '上架' ? '下架' : '上架' } : p
      )
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">商品管理</h1>
        <button className="btn btn-primary">+ 新增商品</button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜尋商品名稱或分類..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>商品名稱</th>
              <th>分類</th>
              <th>價格</th>
              <th>庫存</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>
                  <span style={{ color: product.stock === 0 ? '#dc2626' : 'inherit' }}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`badge ${product.status === '上架' ? 'badge-success' : 'badge-default'}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm" onClick={() => toggleStatus(product.id)}>
                    {product.status === '上架' ? '下架' : '上架'}
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

export default Products
