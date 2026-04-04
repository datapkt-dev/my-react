import { useEffect, useRef, useState } from 'react';
import { fetchReportDetail, patchReportStatus } from '../api/userApi';
import type { ReportDetailResponse } from '../types/user';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number | null;
  onConfirm: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ isOpen, onClose, reportId, onConfirm }) => {
  const [detail, setDetail] = useState<ReportDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [disposition, setDisposition] = useState<'ban' | 'ignore'>('ignore');
  const [dispositionReason, setDispositionReason] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !reportId) return;
    const projectId = Number(localStorage.getItem('project_id')) || 1;
    setLoading(true);
    setDisposition('ignore');
    setDispositionReason('');
    fetchReportDetail(projectId, reportId)
      .then((res) => setDetail(res.data))
      .catch((err) => console.error('Failed to fetch report detail:', err))
      .finally(() => setLoading(false));
  }, [isOpen, reportId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const target = detail?.target_info;
  const report = detail?.report;
  const reporter = report?.reporter;

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center">
      <div ref={modalRef} className="bg-white rounded-[10px] w-[520px] p-5 flex flex-col gap-0 max-h-[90vh] overflow-y-auto">
        {/* 彈窗標題 */}
        <div className="flex justify-between items-center pb-5">
          <span className="text-text-dark text-lg font-medium">檢舉</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none text-text-muted hover:text-text-dark"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-text-light text-sm">載入中...</div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {/* 灰色資訊區塊 */}
            <div className="flex flex-col gap-2.5 bg-bg-gray border border-border rounded p-2.5">
              {/* 被檢舉用戶資訊 */}
              <div className="flex gap-5">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden shrink-0 bg-hover-row">
                  {target?.avatar_url ? (
                    <img src={target.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-2xl">
                      {target?.name?.charAt(0) ?? '?'}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                  <span className="text-text-dark text-sm font-medium">
                    用戶：{target?.name ?? '--'} ({target?.email ?? '--'})
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="text-text-dark text-xs leading-relaxed break-words">
                      個人簡介：--
                    </span>
                  </div>
                </div>
              </div>

              {/* 檢舉人 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-dark text-xs">檢舉人</span>
                <div className="bg-white border border-border rounded px-3 py-2.5">
                  <span className="text-text-dark text-sm">
                    {reporter?.name ?? '--'} ({reporter?.email ?? '--'})
                  </span>
                </div>
              </div>

              {/* 檢舉理由 */}
              <div className="flex flex-col gap-1">
                <span className="text-text-dark text-xs">檢舉理由</span>
                <div className="bg-white border border-border rounded px-3 py-2.5">
                  <span className="text-text-dark text-sm">
                    {report?.reason ?? '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* 處置 checkbox */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-primary flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-text-dark text-sm font-medium">處置</span>
            </div>

            {/* 處置原因 */}
            <div className="flex flex-col gap-1">
              <span className="text-text-dark text-xs">處置原因</span>
              <textarea
                value={dispositionReason}
                onChange={(e) => setDispositionReason(e.target.value)}
                placeholder="填寫原因"
                className="bg-white border border-border rounded px-3 py-2.5 text-sm text-text-dark resize-none min-h-[60px] outline-none focus:border-primary placeholder:text-placeholder"
              />
            </div>

            {/* Radio: 停權 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setDisposition('ban')}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  disposition === 'ban' ? 'border-primary' : 'border-text-muted'
                }`}
              >
                {disposition === 'ban' && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="text-text-dark text-sm" onClick={() => setDisposition('ban')}>停權</span>
            </label>

            {/* Radio: 不處理 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setDisposition('ignore')}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  disposition === 'ignore' ? 'border-primary' : 'border-text-muted'
                }`}
              >
                {disposition === 'ignore' && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="text-text-dark text-sm" onClick={() => setDisposition('ignore')}>不處理</span>
            </label>
          </div>
        )}

        {/* 底部按鈕 */}
        <div className="flex justify-end gap-4 pt-5">
          <button
            onClick={onClose}
            className="h-10 w-[80px] border border-border rounded bg-white text-text-dark text-sm font-medium cursor-pointer hover:bg-bg-zebra"
          >
            返回
          </button>
          <button
            disabled={submitting}
            onClick={async () => {
              if (!reportId) return;
              const projectId = Number(localStorage.getItem('project_id')) || 1;
              const status = disposition === 'ban' ? 'resolved' : 'rejected';
              setSubmitting(true);
              try {
                await patchReportStatus(projectId, reportId, {
                  status,
                  admin_note: dispositionReason,
                });
                onConfirm();
                onClose();
              } catch (err) {
                console.error('Failed to patch report:', err);
                alert('處置失敗，請稍後再試');
              } finally {
                setSubmitting(false);
              }
            }}
            className={`h-10 w-[80px] rounded bg-primary text-white text-sm font-medium cursor-pointer border-none ${
              submitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {submitting ? '處理中...' : '確定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
