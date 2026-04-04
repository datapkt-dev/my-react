import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAccount, login, parseProjectIdFromToken } from '../shared/api/authApi';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'account' | 'password'>('account');
  const [staffNo, setStaffNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffNo.trim()) { setError('請輸入帳號'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await validateAccount(staffNo.trim());
      if (!data.data.exists) { setError('帳號不存在'); return; }
      if (data.data.need_verification) { setError('此帳號需要簡訊驗證，目前尚未支援'); return; }
      setStep('password');
    } catch (err) {
      setError(err instanceof Error ? err.message : '驗證帳號時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) { setError('請輸入密碼'); return; }
    setLoading(true);
    setError('');
    try {
      const loginData = await login({ staff_no: staffNo.trim(), password });
      localStorage.setItem('access_token', loginData.data.access_token);
      localStorage.setItem('refresh_token', loginData.data.refresh_token);
      localStorage.setItem('staff', JSON.stringify(loginData.data.staff));
      const projectId = parseProjectIdFromToken(loginData.data.access_token);
      if (projectId !== null) localStorage.setItem('project_id', String(projectId));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAccount = () => {
    setStep('account');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-login-gradient-from to-login-gradient-to p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] py-12 px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-sans mb-2">後台管理系統</h1>
          <p className="text-sm text-gray-500 font-sans m-0">
            {step === 'account' ? '請輸入您的帳號' : '請輸入您的密碼'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm font-sans mb-5">
            {error}
          </div>
        )}

        {/* Step 1 */}
        {step === 'account' && (
          <form onSubmit={handleValidateAccount} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600 font-sans" htmlFor="staffNo">帳號</label>
              <input
                id="staffNo"
                type="text"
                value={staffNo}
                onChange={(e) => setStaffNo(e.target.value)}
                placeholder="請輸入帳號或 Email"
                className="h-11 px-3.5 text-sm font-sans border border-gray-200 rounded-lg outline-none transition-colors text-gray-700 bg-white focus:border-primary"
                autoFocus
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="h-11 bg-primary text-white text-[15px] font-semibold font-sans border-none rounded-lg cursor-pointer transition-colors mt-1 hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '驗證中...' : '下一步'}
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 'password' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600 font-sans">帳號</label>
              <div className="h-11 px-3.5 text-sm font-sans border border-gray-200 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-between">
                {staffNo}
                <button
                  type="button"
                  onClick={handleBackToAccount}
                  className="bg-transparent border-none text-primary text-[13px] font-sans cursor-pointer py-1 px-2 rounded"
                >
                  更換
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600 font-sans" htmlFor="password">密碼</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                className="h-11 px-3.5 text-sm font-sans border border-gray-200 rounded-lg outline-none transition-colors text-gray-700 bg-white focus:border-primary"
                autoFocus
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="h-11 bg-primary text-white text-[15px] font-semibold font-sans border-none rounded-lg cursor-pointer transition-colors mt-1 hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
