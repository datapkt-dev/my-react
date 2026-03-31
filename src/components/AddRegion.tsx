import React, { useState, useEffect } from 'react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; memeberPings: string; nonMemberPings: string; }) => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [memberPings, setMemberPings] = useState('');
  const [nonMemberPings, setNonMemberPings] = useState('');
  const [errors, setErrors] = useState<{ name?: string; memberPings?: string; nonMemberPings?: string; }>({});

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
    const newErrors: { name?: string; memberPings?: string; nonMemberPings?: string; } = {};
    const pings = /^\d+$/;
    if (!name.trim()) newErrors.name = '地區不能為空';
    if (!memberPings.trim()) newErrors.memberPings = '會員Pings不能為空';
    else if (!pings.test(memberPings.trim())) newErrors.memberPings = '只能輸入數字';
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
    onSubmit({ name: name.trim(), memeberPings: memberPings, nonMemberPings: nonMemberPings });
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
        <h2 className="m-0 mb-6 text-lg font-semibold text-text-dark tracking-wide flex justify-between">
          新增地區
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-white text-lg"
          >
            X
          </button>
        </h2>

        {/* 名稱 */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">名稱</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名稱"
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none focus:border-primary"
          />
          {errors.name && <div className="mt-1 text-xs text-danger tracking-wide">{errors.name}</div>}
        </div>

        {/* 會員Pings */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">會員Pings數量</label>
          <input
            type="text"
            value={memberPings}
            onChange={(e) => setMemberPings(e.target.value)}
            placeholder="請輸入"
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none focus:border-primary"
          />
          {errors.memberPings && <div className="mt-1 text-xs text-danger tracking-wide">{errors.memberPings}</div>}
        </div>

        {/* 非會員Pings */}
        <div className="mb-4">
          <label className="block mb-1.5 text-sm text-text-medium font-medium tracking-wide">非會員Pings數量</label>
          <input
            type="text"
            value={nonMemberPings}
            onChange={(e) => setNonMemberPings(e.target.value)}
            placeholder="請輸入"
            className="w-full h-10 px-3 border border-border rounded text-sm font-sans text-text-dark box-border outline-none focus:border-primary"
          />
          {errors.nonMemberPings && <div className="mt-1 text-xs text-danger tracking-wide">{errors.nonMemberPings}</div>}
        </div>

        {/* 按鈕區 */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="h-10 min-w-[88px] px-4 bg-white text-text-medium border border-border rounded text-sm font-medium cursor-pointer tracking-wide font-sans"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="h-10 min-w-[88px] px-4 bg-primary text-white border-none rounded text-sm font-medium cursor-pointer tracking-wide font-sans"
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
