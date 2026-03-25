import { useEffect} from 'react';

export interface FilterValues {
  account: string;
  nationality: string;
  city: string;
  name: string;
  birthday: string
  //membershipType: string;
  //bannedStatus: 'all' | 'active' | 'banned';
}

interface FilterPanelProps {
  isOpen: boolean;
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
  filterValue: string;
  setFilterValue: (values: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  values,
  onChange,
  onApply,
  onReset,
  onClose,
  filterValue,
  setFilterValue,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOnReset = () =>{
    onReset();
  }
  const inputStyle : React.CSSProperties = {
    height: 40,
    padding: '0 12px',
    border: '1px solid #D1D5DB',
    borderRadius: 6,
    fontSize: 14,
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Slide-out panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 320,
          height: '100vh',
          background: 'white',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          fontFamily: 'Noto Sans TC, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: '600', color: '#1e293b', letterSpacing: 0.5 }}>
            篩選
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: 20,
              lineHeight: 1,
            }}
            aria-label="關閉篩選面板"
          >
            ✕
          </button>
        </div>

        {/* Filter fields */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Account */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              會員帳號
            </label>
            <input
              type="text"
              value={values.account}
              onChange={(e) => onChange({ ...values, account: e.target.value })}
              placeholder="🔍搜尋會員帳號"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#1383D3')}
              onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
            />
          </div>

          {/* Nationality */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              國籍
            </label>
            <select 
              style={inputStyle}
              onChange={(e) => onChange({ ...values, nationality: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = '#1383D3')}
              onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
              value={values.nationality}
            >
              <option value=''>請選擇</option>
              <option value='America'>北美</option>
              <option value='Taiwan'>台灣</option>
            </select>
          </div>

          {/* City */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              城市
            </label>
            <select onChange={(e) => onChange({...values, city: (e.target as HTMLSelectElement).value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#1383D3')}
              onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}     
              value={values.city}       
            >
              <option value=''>請選擇</option>
              <option value='New York'>紐約</option>
              <option value='Taipei'>台北</option>
            </select>
          </div>

          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              會員姓名
            </label>
            <input
              type="text"
              value={values.name}
              onChange={(e) => onChange({ ...values, name: e.target.value })}
              placeholder="🔍搜尋會員姓名"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#1383D3')}
              onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
            />
          </div>

          {/* Birthday */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              會員生日
            </label>
            <input
              type="text"
              value={values.birthday}
              onChange={(e) => onChange({ ...values, birthday: e.target.value })}
              placeholder="📅搜尋會員生日"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#1383D3';
                e.target.type = 'date';
                setTimeout(() => e.target.showPicker(), 10);
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.type = 'text';
                setTimeout(() => e.target.showPicker(), 10);
              }}
            />
          </div>
          {/* Banned status */}
          {/*<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: '500', color: '#374151', letterSpacing: 0.5 }}>
              帳號狀態
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(
                [
                  { value: 'all', label: '全部' },
                  { value: 'active', label: '正常' },
                  { value: 'banned', label: '已停用' },
                ] as const
              ).map(({ value, label }) => (
                <label
                  key={value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#374151',
                  }}
                >
                  <input
                    type="radio"
                    name="bannedStatus"
                    value={value}
                    checked={values.bannedStatus === value}
                    onChange={() => onChange({ ...values, bannedStatus: value })}
                    style={{ accentColor: '#1383D3', width: 16, height: 16 }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>*/}
        </div>

        {/* Footer buttons */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            gap: 12,
          }}
        >
          <button
            onClick={handleOnReset}
            style={{
              flex: 1,
              height: 40,
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              background: 'white',
              color: '#374151',
              fontSize: 14,
              fontWeight: '500',
              cursor: 'pointer',
              letterSpacing: 0.5,
              fontFamily: 'Noto Sans TC, sans-serif',
            }}
          >
            清除重選
          </button>
          <button
            onClick={onApply}
            style={{
              flex: 1,
              height: 40,
              border: 'none',
              borderRadius: 6,
              background: '#1383D3',
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
              cursor: 'pointer',
              letterSpacing: 0.5,
              fontFamily: 'Noto Sans TC, sans-serif',
            }}
          >
            查詢
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
