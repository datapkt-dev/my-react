import React, { useState, useEffect } from 'react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; staff_no: string; email: string }) => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [staffNo, setStaffNo] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; staff_no?: string; email?: string }>({});

  // 關閉時重置表單
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setStaffNo('');
      setEmail('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors: { name?: string; staff_no?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = '姓名不能為空';
    if (!staffNo.trim()) newErrors.staff_no = '帳號不能為空';
    if (!email.trim()) {
      newErrors.email = 'Email 不能為空';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = '請輸入有效的 Email 格式';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ name: name.trim(), staff_no: staffNo.trim(), email: email.trim() });
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
          />
          {errors.email && <div style={errorStyle}>{errors.email}</div>}
        </div>

        {/* 按鈕區 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
          <button
            onClick={onClose}
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
              cursor: 'pointer',
              letterSpacing: 1,
              fontFamily: 'Noto Sans TC, sans-serif',
            }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            style={{
              height: 40,
              minWidth: 88,
              padding: '0 16px',
              background: '#1383D3',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: '500',
              cursor: 'pointer',
              letterSpacing: 1,
              fontFamily: 'Noto Sans TC, sans-serif',
            }}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
