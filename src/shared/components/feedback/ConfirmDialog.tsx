import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = '取消',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center">
      <div className="bg-white rounded-[10px] w-[400px] p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-text-dark text-lg font-medium">{title}</span>
          <button
            onClick={onCancel}
            className="w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none text-text-muted hover:text-text-dark"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {message && (
          <p className="text-text-medium text-sm m-0">{message}</p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="h-10 w-[80px] border border-border rounded bg-white text-text-dark text-sm font-medium cursor-pointer hover:bg-bg-zebra"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`h-10 w-[80px] rounded text-white text-sm font-medium cursor-pointer border-none hover:opacity-90 ${
              variant === 'danger' ? 'bg-danger' : 'bg-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
