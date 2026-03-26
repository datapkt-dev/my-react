import React, { useState, useEffect } from 'react';
import type { CreateStaffPayload } from '../types/staff';

interface AddStaffModalProps {
  isOpen: boolean;
  loading?: boolean;
  apiError?: string | null;
  onClose: () => void;
  onSubmit: (data: CreateStaffPayload) => void;
}

const ROLE_OPTIONS = [
  { id: 1, label: 'Super Admin' },
  { id: 2, label: 'Admin' },
  { id: 3, label: 'Staff' },
];

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, loading = false, apiError = null, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [staffNo, setStaffNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState<number>(2);
  const [errors, setErrors] = useState<{ name?: string; staff_no?: string; email?: string; phone?: string }>({});

  // 關閉時重置表單
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setStaffNo('');
      setEmail('');
      setPhone('');
      setRoleId(2);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;

  const validate = () => {
    const newErrors: { name?: string; staff_no?: string; email?: string; phone?: string } = {};
    if (!name.trim()) newErrors.name = '姓名不能為空';
    if (!staffNo.trim()) newErrors.staff_no = '帳號不能為空';
    if (!email.trim()) {
      newErrors.email = 'Email 不能為空';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = '請輸入有效的 Email 格式';
    }
    if (!phone.trim()) {
      newErrors.phone = '手機不能為空';
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = '請輸入有效的手機號碼（如 +886912345678）';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      name: name.trim(),
      staff_no: staffNo.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role_id: roleId,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 40,
    padding: '0 12px',
    border: '1px solid #DEE2E6',
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'Noto Sans TC, sans-serif',
    color: '#333333',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontSize: 14,
    color: '#454545',
    fontWeight: '500',
    letterSpacing: 0.5,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 16,
  };

  const errorStyle: React.CSSProperties = {
    marginTop: 4,
    fontSize: 12,
    color: '#FF4444',
    letterSpacing: 0.3,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        fontFamily: 'Noto Sans TC, sans-serif',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 480,
          background: 'white',
          borderRadius: 8,
          padding: '28px 32px',
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* 標題 */}
        <h2 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: '600', color: '#333333', letterSpacing: 0.5 }}>
          新增員工
        </h2>

        {/* 姓名 */}
        <div style={fieldStyle}>
          <label style={labelStyle}>姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="請輸入姓名"
            style={inputStyle}
            disabled={loading}
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>

        {/* 帳號 */}
        <div style={fieldStyle}>
          <label style={labelStyle}>帳號</label>
          <input
            type="text"
            value={staffNo}
            onChange={(e) => setStaffNo(e.target.value)}
            placeholder="請輸入帳號"
            style={inputStyle}
            disabled={loading}
          />
          {errors.staff_no && <div style={errorStyle}>{errors.staff_no}</div>}
        </div>

        {/* Email */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請輸入 Email"
            style={inputStyle}
            disabled={loading}
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
        </div>

        {/* 手機 */}
        <div style={fieldStyle}>
          <label style={labelStyle}>手機</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="請輸入手機號碼（如 +886912345678）"
            style={inputStyle}
            disabled={loading}
          />
          {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
        </div>

        {/* 角色 */}
        <div style={fieldStyle}>
          <label style={labelStyle}>角色</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            style={{ ...inputStyle, appearance: 'auto' }}
            disabled={loading}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
        </div>

        {/* API 錯誤訊息 */}
        {apiError && (
          <div style={{ marginBottom: 12, padding: '8px 12px', background: '#FFF0F0', border: '1px solid #FFCCCC', borderRadius: 4, color: '#FF4444', fontSize: 13, letterSpacing: 0.3 }}>
            {apiError}
          </div>
        )}

        {/* 按鈕區 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              height: 40,
              minWidth: 88,
              padding: '0 16px',
              background: 'white',
              color: '#454545',
              border: '1px solid #DEE2E6',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: 1,
              fontFamily: 'Noto Sans TC, sans-serif',
              opacity: loading ? 0.6 : 1,
            }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              height: 40,
              minWidth: 88,
              padding: '0 16px',
              background: loading ? '#7FBDE8' : '#1383D3',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: 1,
              fontFamily: 'Noto Sans TC, sans-serif',
            }}
          >
            {loading ? '送出中...' : '送出'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
