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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000] font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[480px] bg-white rounded-lg py-7 px-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
      >
        {/* 標題 */}
        <h2 className="m-0 mb-6 text-lg font-semibold text-text-dark tracking-wide">新增員工</h2>

        {/* 姓名 */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="請輸入姓名"
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none focus:border-primary"
            disabled={loading}
          />
          {errors.name && <div className="mt-1 text-xs text-danger tracking-wide">{errors.name}</div>}
        </div>

        {/* 帳號 */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">帳號</label>
          <input
            type="text"
            value={staffNo}
            onChange={(e) => setStaffNo(e.target.value)}
            placeholder="請輸入帳號"
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none focus:border-primary"
            disabled={loading}
          />
          {errors.staff_no && <div className="mt-1 text-xs text-danger tracking-wide">{errors.staff_no}</div>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請輸入 Email"
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none focus:border-primary"
            disabled={loading}
          />
          {errors.email && <div className="mt-1 text-xs text-danger tracking-wide">{errors.email}</div>}
        </div>

        {/* 手機 */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">手機</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="請輸入手機號碼（如 +886912345678）"
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none focus:border-primary"
            disabled={loading}
          />
          {errors.phone && <div className="mt-1 text-xs text-danger tracking-wide">{errors.phone}</div>}
        </div>

        {/* 角色 */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">角色</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none appearance-auto focus:border-primary"
            disabled={loading}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
        </div>

        {/* API 錯誤訊息 */}
        {apiError && (
          <div className="mb-3 px-3 py-2 bg-danger-light border border-[#FFCCCC] rounded text-danger text-[13px] tracking-wide">
            {apiError}
          </div>
        )}

        {/* 按鈕區 */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className={`h-10 min-w-[88px] px-4 bg-white text-text-medium border border-border rounded text-sm font-medium tracking-wide font-sans ${
              loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-10 min-w-[88px] px-4 text-white border-none rounded text-sm font-medium tracking-wide font-sans ${
              loading ? 'bg-[#7FBDE8] cursor-not-allowed' : 'bg-primary cursor-pointer'
            }`}
          >
            {loading ? '送出中...' : '送出'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
