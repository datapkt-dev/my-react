import React, { useState, useEffect } from 'react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; staff_no: string; email: string; phone: string }) => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [staffNo, setStaffNo] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; staff_no?: string; email?: string; phone?: string }>({});

  // 關閉時重置表單
  useEffect(() => {
    if (!isOpen) {
      setStaffNo('');
      setName('');
      setPhone('');
      setEmail('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors: { name?: string; staff_no?: string; email?: string; phone?: string } = {};
    if (!staffNo.trim()) newErrors.staff_no = '帳號不能為空';
    if (!name.trim()) newErrors.name = '姓名不能為空';
    if (!phone.trim()) newErrors.phone = '手機不能為空';
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
    onSubmit({ staff_no: staffNo.trim(), name: name.trim(), phone: phone.trim(), email: email.trim() });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 48,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
    border: 'none',
    borderRadius: 6,
    outline: '1px solid #DEE2E6',
    outlineOffset: '-1px',
    fontSize: 16,
    fontFamily: 'Noto Sans TC, sans-serif',
    color: '#333333',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    color: '#333333',
    fontWeight: '400',
    lineHeight: '16.80px',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  };

  const errorStyle: React.CSSProperties = {
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
          borderRadius: 10,
          padding: 20,
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* 標題列 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: '500', color: '#333333', letterSpacing: 1 }}>
            新增管理員
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 24,
              height: 24,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#28303F',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* 欄位區 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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

          {/* 手機 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>手機</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="請輸入手機"
              style={inputStyle}
            />
            {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
          </div>

          {/* 信箱 */}
          <div style={fieldStyle}>
            <label style={labelStyle}>信箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入信箱"
              style={inputStyle}
            />
            {errors.email && <div style={errorStyle}>{errors.email}</div>}
          </div>
        </div>

        {/* 按鈕區 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
          <button
            onClick={handleSubmit}
            style={{
              width: 88,
              height: 36,
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
            新增
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
