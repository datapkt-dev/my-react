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
    <div className="w-full py-5 px-7 bg-white font-sans">
      <h1 className="text-text-medium text-2xl font-medium m-0 tracking-wide mb-5">系統設定</h1>

      <div className="bg-white rounded-[10px] border border-[#EDEDED] p-6">
        <h2 className="text-text-medium text-lg font-semibold mb-5">一般設定</h2>
        <div className="mb-4">
          <label className="block mb-1.5 text-sm font-medium text-text-medium tracking-wide">網站名稱</label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-border rounded text-sm text-text-dark outline-none font-sans focus:border-primary"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1.5 text-sm font-medium text-text-medium tracking-wide">管理員 Email</label>
          <input
            type="email"
            className="w-full h-10 px-3 border border-border rounded text-sm text-text-dark outline-none font-sans focus:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1.5 text-sm font-medium text-text-medium tracking-wide">語言</label>
          <select
            className="w-full h-10 px-3 border border-border rounded text-sm text-text-dark outline-none font-sans focus:border-primary"
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

      <div className="bg-white rounded-[10px] border border-[#EDEDED] p-6 mt-5">
        <h2 className="text-text-medium text-lg font-semibold mb-5">偏好設定</h2>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-text-medium">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            <span>啟用通知</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-text-medium">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            <span>深色模式（尚未實作）</span>
          </label>
        </div>
      </div>

      <div className="mt-5">
        <button
          className="h-10 min-w-[88px] px-4 bg-primary text-white border-none rounded text-sm font-medium cursor-pointer tracking-wide hover:bg-primary-hover"
          onClick={handleSave}
        >
          儲存設定
        </button>
        {saved && <span className="ml-3 text-success text-sm font-medium">✓ 設定已儲存！</span>}
      </div>
    </div>
  )
}

export default Settings
