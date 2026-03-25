import React, { useState, useEffect } from 'react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; memeberPings: string; nonMemberPings: string;}) => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [memberPings, setMemberPings] = useState('');
  const [nonMemberPings, setNonMemberPings] = useState('');
  const [errors, setErrors] = useState<{ name?: string; memberPings?: string; nonMemberPings?: string;}>({});

  // 關閉時重置表單
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setMemberPings('');
      setNonMemberPings('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; memberPings?: string; nonMemberPings?: string;} = {};
    const pings = /^\d+$/;
    if (!name.trim()) newErrors.name = '地區不能為空';
    if (!memberPings.trim()) newErrors.memberPings = '會員Pings不能為空';
    else if(!pings.test(memberPings.trim())) newErrors.memberPings = '只能輸入數字';
    if (!nonMemberPings.trim()) newErrors.nonMemberPings = '非會員Pings不能為空';
    else if (!pings.test(nonMemberPings.trim())) newErrors.nonMemberPings = '只能輸入數字';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ name: name.trim(), memeberPings: memberPings, nonMemberPings: nonMemberPings});
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
        <h2 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: '600', color: '#333333', letterSpacing: 0.5, 
            display:'flex', justifyContent:'space-between'
        }}>
          新增地區
          <button onClick={onClose}
            style={{
              cursor: 'pointer',
              border: 'none',
              background:'#fff',
              fontSize:'18px'
            }}>X
          </button>
        </h2>
        {/* 名稱 */}
        <div style={fieldStyle}>
          <label style={labelStyle}>名稱</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名稱"
            style={inputStyle}
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>

        {/* 會員Pings */}
        <div style={fieldStyle}>
          <label style={labelStyle}>會員Pings數量</label>
          <input
            type="text"
            value={memberPings}
            onChange={(e) => setMemberPings(e.target.value)}
            placeholder="請輸入"
            style={inputStyle}
          />
          {errors.memberPings && <div style={errorStyle}>{errors.memberPings}</div>}
        </div>

        {/* 非會員Pings*/}
        <div style={fieldStyle}>
          <label style={labelStyle}>非會員Pings數量</label>
          <input
            type='text'
            value={nonMemberPings}
            onChange={(e) => setNonMemberPings(e.target.value)}
            placeholder="請輸入"
            style={inputStyle}
          />
          {errors.nonMemberPings && <div style={errorStyle}>{errors.nonMemberPings}</div>}
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
            新增
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
