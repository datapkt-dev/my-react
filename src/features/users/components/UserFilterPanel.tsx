import { useEffect } from 'react';
import DatePic from '../../../assets/date.svg'
import SearchPic from '../../../assets/search.svg'

export interface FilterValues {
  account: string;
  nationality: string;
  city: string;
  name: string;
  birthday: string;
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
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOnReset = () => {
    onReset();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/20 z-[200] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-white shadow-[-4px_0_20px_rgba(0,0,0,0.12)] z-[201] flex flex-col font-sans transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-5 px-6">
          <span className="text-xl font-semibold text-slate-800 tracking-wide">篩選</span>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-gray-500 text-xl leading-none"
            aria-label="關閉篩選面板"
          >
            ✕
          </button>
        </div>

        {/* Filter fields */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">

          {/* Account */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">會員帳號</label>
            <div className="w-full p-3 rounded-md outline outline-1 outline-border -outline-offset-1 inline-flex items-center gap-2">
              <img src={SearchPic} />
              <input
                type="text"
                value={values.account}
                onChange={(e) => onChange({ ...values, account: e.target.value })}
                placeholder="搜尋會員帳號"
                className="h-10 px-3 border-none rounded-md text-base text-slate-800 outline-none w-full"
              />
            </div>
          </div>

          {/* Nationality */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">國籍</label>
            <select
              className="h-10 px-3 border border-gray-300 rounded-md text-base text-slate-800 outline-none w-full focus:border-primary"
              onChange={(e) => onChange({ ...values, nationality: e.target.value })}
              value={values.nationality}
            >
              <option value=''>請選擇</option>
              <option value='America'>北美</option>
              <option value='Taiwan'>台灣</option>
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">城市</label>
            <select
              onChange={(e) => onChange({ ...values, city: (e.target as HTMLSelectElement).value })}
              className="h-10 px-3 border border-gray-300 rounded-md text-base text-slate-800 outline-none w-full focus:border-primary"
              value={values.city}
            >
              <option value=''>請選擇</option>
              <option value='New York'>紐約</option>
              <option value='Taipei'>台北</option>
            </select>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">會員姓名</label>
            <div className="w-full p-3 rounded-md outline outline-1 outline-border -outline-offset-1 inline-flex items-center gap-2">
              <img src={SearchPic} />
              <input
                type="text"
                value={values.name}
                onChange={(e) => onChange({ ...values, name: e.target.value })}
                placeholder="搜尋會員姓名"
                className="h-10 px-3 border-none rounded-md text-base text-slate-800 outline-none w-full"
              />
            </div>
          </div>

          {/* Birthday */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">會員生日</label>
            <div className="w-full p-3 rounded-md outline outline-1 outline-border -outline-offset-1 inline-flex items-center gap-2">
              <img src={DatePic} />
              <input
                type="text"
                value={values.birthday}
                onChange={(e) => onChange({ ...values, birthday: e.target.value })}
                placeholder="搜尋會員生日"
                className="h-10 px-3 border-none rounded-md text-base text-slate-800 outline-none w-full"
                onFocus={(e) => {
                  e.target.type = 'date';
                  setTimeout(() => e.target.showPicker(), 10);
                }}
                onBlur={(e) => {
                  e.target.type = 'text';
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 py-4 px-6">
            <button
              onClick={handleOnReset}
              className="flex-1 h-10 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium cursor-pointer tracking-wide font-sans"
            >
              清除重選
            </button>
            <button
              onClick={onApply}
              className="flex-1 h-10 border-none rounded-md bg-primary text-white text-sm font-medium cursor-pointer tracking-wide font-sans"
            >
              查詢
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
