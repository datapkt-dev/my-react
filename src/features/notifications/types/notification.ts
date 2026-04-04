// ==========================================
// 通知管理 Types
// ==========================================

/** 通知類型 */
export interface Notification {
  id: number;
  /** 標題 */
  title: string;
  /** 發佈時間 */
  publishTime: string;
  /** 發佈對象 */
  targetAudience: string;
  /** 發佈內容 */
  content: string;
}

/** 排序方向 */
export type SortDirection = 'asc' | 'desc' | null;

/** 可排序的欄位 key */
export type SortableNotificationField = 'publishTime';

/** 排序狀態 */
export interface NotificationSortState {
  field: SortableNotificationField | null;
  direction: SortDirection;
}
