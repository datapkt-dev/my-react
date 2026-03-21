import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAccount, login, parseProjectIdFromToken } from '../api/authApi';

// ==========================================
// Login Page Component
// ==========================================

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Steps: 'account' = 輸入帳號, 'password' = 輸入密碼
  const [step, setStep] = useState<'account' | 'password'>('account');
  const [staffNo, setStaffNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ====== Step 1: 驗證帳號是否存在 ======
  const handleValidateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffNo.trim()) {
      setError('請輸入帳號');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await validateAccount(staffNo.trim());

      if (!data.data.exists) {
        setError('帳號不存在');
        return;
      }

      if (data.data.need_verification) {
        setError('此帳號需要簡訊驗證，目前尚未支援');
        return;
      }

      // 帳號存在且不需要驗證 → 進入密碼步驟
      setStep('password');
    } catch (err) {
      setError(err instanceof Error ? err.message : '驗證帳號時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // ====== Step 2: 登入 ======
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('請輸入密碼');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loginData = await login({
        staff_no: staffNo.trim(),
        password: password,
      });

      // 儲存 token 及使用者資訊到 localStorage
      localStorage.setItem('access_token', loginData.data.access_token);
      localStorage.setItem('refresh_token', loginData.data.refresh_token);
      localStorage.setItem('staff', JSON.stringify(loginData.data.staff));

      // 從 JWT 解析 project_id 並儲存
      const projectId = parseProjectIdFromToken(loginData.data.access_token);
      if (projectId !== null) {
        localStorage.setItem('project_id', String(projectId));
      }

      // 導向首頁
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // ====== 返回帳號步驟 ======
  const handleBackToAccount = () => {
    setStep('account');
    setPassword('');
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo / 標題 */}
        <div style={styles.header}>
          <h1 style={styles.title}>後台管理系統</h1>
          <p style={styles.subtitle}>
            {step === 'account' ? '請輸入您的帳號' : '請輸入您的密碼'}
          </p>
        </div>

        {/* 錯誤訊息 */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Step 1: 帳號驗證 */}
        {step === 'account' && (
          <form onSubmit={handleValidateAccount} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="staffNo">帳號</label>
              <input
                id="staffNo"
                type="text"
                value={staffNo}
                onChange={(e) => setStaffNo(e.target.value)}
                placeholder="請輸入帳號或 Email"
                style={styles.input}
                autoFocus
                disabled={loading}
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? '驗證中...' : '下一步'}
            </button>
          </form>
        )}

        {/* Step 2: 密碼登入 */}
        {step === 'password' && (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>帳號</label>
              <div style={styles.accountDisplay}>
                {staffNo}
                <button
                  type="button"
                  onClick={handleBackToAccount}
                  style={styles.changeBtn}
                >
                  更換
                </button>
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="password">密碼</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                style={styles.input}
                autoFocus
                disabled={loading}
              />
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? '登入中...' : '登入'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ==========================================
// Styles
// ==========================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #E8F4FD 0%, #F0F4F8 100%)',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#FFFFFF',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    padding: '48px 40px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1A202C',
    fontFamily: 'Noto Sans TC, sans-serif',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    fontFamily: 'Noto Sans TC, sans-serif',
    margin: 0,
  },
  errorBox: {
    background: '#FFF5F5',
    color: '#C53030',
    border: '1px solid #FED7D7',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    fontFamily: 'Noto Sans TC, sans-serif',
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: '#4A5568',
    fontFamily: 'Noto Sans TC, sans-serif',
  },
  input: {
    height: 44,
    padding: '0 14px',
    fontSize: 14,
    fontFamily: 'Noto Sans TC, sans-serif',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    outline: 'none',
    transition: 'border-color 0.2s',
    color: '#2D3748',
    background: '#FFFFFF',
  },
  button: {
    height: 44,
    background: '#1383D3',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'Noto Sans TC, sans-serif',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: 4,
  },
  accountDisplay: {
    height: 44,
    padding: '0 14px',
    fontSize: 14,
    fontFamily: 'Noto Sans TC, sans-serif',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    background: '#F7FAFC',
    color: '#4A5568',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeBtn: {
    background: 'none',
    border: 'none',
    color: '#1383D3',
    fontSize: 13,
    fontFamily: 'Noto Sans TC, sans-serif',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 4,
  },
};

export default Login;
