import React, { useState, useEffect } from 'react';
import { addNotification } from '../../../api/notificationApi';

// ==========================================
// Types
// ==========================================

export interface NotificationDetail {
  id?: number;
  title: string;
  content: string;
  time_added?: string;
}

interface NotificationDetailModalProps {
  /** 是否顯示 */
  isOpen: boolean;
  /** create = 新增推播 / view = 查看推播 */
  mode: 'create' | 'view';
  /** 查看模式下的資料 */
  data?: NotificationDetail | null;
  /** 關閉彈窗 */
  onClose: () => void;
  /** 新增成功後回呼 */
  onCreated?: () => void;
}

// ==========================================
// Close Icon (仿 nexly-web window-box-close)
// ==========================================

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="var(--color-text-dark)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ==========================================
// NotificationDetailModal
// (仿 Vue nexly-web notificationDetailWindow.vue)
// ==========================================

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  isOpen,
  mode,
  data,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 開啟彈窗時初始化
  useEffect(() => {
    if (isOpen) {
      if (mode === 'view' && data) {
        setTitle(data.title);
        setContent(data.content);
      } else {
        setTitle('');
        setContent('');
      }
      setError('');
    }
  }, [isOpen, mode, data]);

  // 新增推播
  const handleCreate = async () => {
    if (!title.trim()) {
      setError('請輸入標題');
      return;
    }
    if (!content.trim()) {
      setError('請輸入內容');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await addNotification({
        creator: 8,
        title: title.trim(),
        content: content.trim(),
      });
      onCreated?.();
      onClose();
    } catch {
      setError('新增推播失敗，請洽管理員！');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      >
        {/* 彈窗主體 (仿 .window-box max-width:593px) */}
        <div
          className="bg-white flex flex-col"
          style={{
            width: '100%',
            maxWidth: 593,
            borderRadius: 10,
            padding: 24,
            gap: 20,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ===== 標題列 ===== */}
          <div className="flex items-center justify-between">
            <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-dark)' }}>
              {mode === 'create' ? '新增推播' : '查看推播'}
            </div>
            <button
              className="bg-transparent border-none cursor-pointer p-0 flex items-center"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>

          {/* ===== 標題輸入框 ===== */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-dark)' }}>
              標題 <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={mode === 'view'}
              style={{
                height: 44,
                padding: '0 12px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 14,
                color: 'var(--color-text-dark)',
                outline: 'none',
                background: mode === 'view' ? 'var(--color-bg-gray)' : 'var(--color-white)',
              }}
            />
          </div>

          {/* ===== 推播內容 ===== */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-dark)' }}>
              輸入內容
            </label>
            <textarea
              placeholder="請輸入推播內容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={mode === 'view'}
              rows={5}
              style={{
                padding: 12,
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                fontSize: 14,
                color: 'var(--color-text-dark)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                background: mode === 'view' ? 'var(--color-bg-gray)' : 'var(--color-white)',
              }}
            />
          </div>

          {/* ===== 發布對象 ===== */}
          <div className="flex items-center" style={{ gap: 16 }}>
            <div style={{ whiteSpace: 'nowrap', fontSize: 14, color: 'var(--color-text-dark)' }}>
              發布對象
            </div>
            <label className="flex items-center" style={{ gap: 6, fontSize: 14, color: 'var(--color-text-light)' }}>
              <input type="checkbox" checked disabled style={{ accentColor: 'var(--color-primary)' }} />
              全部
            </label>
          </div>

          {/* ===== 發布時間 ===== */}
          <div className="flex items-center" style={{ gap: 16 }}>
            <div style={{ whiteSpace: 'nowrap', fontSize: 14, color: 'var(--color-text-dark)' }}>
              發布時間
            </div>
            <label className="flex items-center" style={{ gap: 6, fontSize: 14, color: 'var(--color-text-light)' }}>
              <input type="checkbox" checked disabled style={{ accentColor: 'var(--color-primary)' }} />
              立即發布
            </label>
          </div>

          {/* ===== 錯誤訊息 ===== */}
          {error && (
            <div style={{ fontSize: 13, color: 'var(--color-danger)' }}>{error}</div>
          )}

          {/* ===== 操作按鈕 ===== */}
          <div className="flex justify-end" style={{ gap: 10 }}>
            {mode === 'create' && (
              <button
                onClick={handleCreate}
                disabled={submitting}
                style={{
                  height: 40,
                  padding: '0 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? '新增中...' : '新增'}
              </button>
            )}
            {mode === 'view' && (
              <button
                onClick={onClose}
                style={{
                  height: 40,
                  padding: '0 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                確定
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationDetailModal;
