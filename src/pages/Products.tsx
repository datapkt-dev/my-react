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
    <div className="w-full py-5 px-7 bg-white font-sans">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-text-medium text-2xl font-medium m-0 tracking-wide">商品管理</h1>
        <button className="h-10 min-w-[88px] px-3 bg-primary text-white border-none rounded text-sm font-medium cursor-pointer tracking-wide hover:bg-primary-hover">
          + 新增商品
        </button>
      </div>

      <div className="bg-white rounded-[10px] border border-card-border p-5">
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋商品名稱或分類..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-3 border border-border rounded text-sm text-text-dark outline-none font-sans focus:border-primary"
          />
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2.5 text-text-muted text-sm font-medium tracking-wide">ID</th>
              <th className="text-left py-3 px-2.5 text-text-muted text-sm font-medium tracking-wide">商品名稱</th>
              <th className="text-left py-3 px-2.5 text-text-muted text-sm font-medium tracking-wide">分類</th>
              <th className="text-left py-3 px-2.5 text-text-muted text-sm font-medium tracking-wide">價格</th>
              <th className="text-left py-3 px-2.5 text-text-muted text-sm font-medium tracking-wide">庫存</th>
              <th className="text-left py-3 px-2.5 text-text-muted text-sm font-medium tracking-wide">狀態</th>
              <th className="text-left py-3 px-2.5 text-text-muted text-sm font-medium tracking-wide">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id} className={`hover:bg-hover-row ${index % 2 === 0 ? 'bg-white' : 'bg-bg-zebra'}`}>
                <td className="py-3 px-2.5 text-text-medium text-sm">{product.id}</td>
                <td className="py-3 px-2.5 text-text-medium text-sm">{product.name}</td>
                <td className="py-3 px-2.5 text-text-medium text-sm">{product.category}</td>
                <td className="py-3 px-2.5 text-text-medium text-sm">${product.price}</td>
                <td className="py-3 px-2.5 text-sm">
                  <span className={product.stock === 0 ? 'text-danger' : 'text-text-medium'}>
                    {product.stock}
                  </span>
                </td>
                <td className="py-3 px-2.5 text-sm">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === '上架'
                      ? 'bg-success-light text-success'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-2.5 text-sm">
                  <button
                    className="h-8 px-3 bg-white text-text-medium border border-border rounded text-xs cursor-pointer hover:bg-bg-gray"
                    onClick={() => toggleStatus(product.id)}
                  >
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
