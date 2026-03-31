// ==========================================
// 用戶分析列表 Types
// ==========================================

/** 排序方向 */
export type SortDirection = 'asc' | 'desc' | null;

/** 可排序的欄位 key（數值型欄位） */
export type SortableField =
  | 'postCount'
  | 'commentCount'
  | 'likeCount'
  | 'reportCount'
  | 'reportedPostCount'
  | 'bookmarkCount';

/** 用戶分析資料（前端使用） */
export interface UserAnalytics {
  id: string;
  /** 會員帳號 */
  account: string;
  /** 用戶名稱 */
  displayName: string;
  /** 貼文數 */
  postCount: number;
  /** 留言數 */
  commentCount: number;
  /** 按讚數 */
  likeCount: number;
  /** 檢舉數 */
  reportCount: number;
  /** 被檢舉貼文數 */
  reportedPostCount: number;
  /** 收藏數 */
  bookmarkCount: number;
}

/** API 回傳的單筆用戶分析 */
export interface UserAnalyticsApiItem {
  user_id: number;
  account: string;
  name: string;
  tales_count: number;
  comments_count: number;
  likes_given_count: number;
  reports_count: number;
  reported_tales_count: number;
  favorites_count: number;
}

/** API 回傳格式 */
export interface UserAnalyticsApiResponse {
  message: string;
  data: {
    items: UserAnalyticsApiItem[];
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
}

/** 排序狀態 */
export interface SortState {
  field: SortableField | null;
  direction: SortDirection;
}
