import { useState } from 'react'

function Settings() {
  const [siteName, setSiteName] = useState('我的後台管理系統')
  const [email, setEmail] = useState('admin@example.com')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('zh-TW')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="page-title">系統設定</h1>

      <div className="card">
        <h2 className="card-title">一般設定</h2>
        <div className="form-group">
          <label className="form-label">網站名稱</label>
          <input
            type="text"
            className="form-input"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">管理員 Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">語言</label>
          <select
            className="form-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="zh-TW">繁體中文</option>
            <option value="zh-CN">簡體中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h2 className="card-title">偏好設定</h2>
        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span>啟用通知</span>
          </label>
        </div>
        <div className="form-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span>深色模式（尚未實作）</span>
          </label>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-primary" onClick={handleSave}>
          儲存設定
        </button>
        {saved && <span className="save-msg">✓ 設定已儲存！</span>}
      </div>
    </div>
  )
}

export default Settings
