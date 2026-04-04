// ==========================================
// 貼文分析列表 Types
// ==========================================

/** 排序方向 */
export type SortDirection = 'asc' | 'desc' | null;

/** 可排序的欄位 key（數值型欄位） */
export type SortablePostField =
  | 'commentCount'
  | 'replyCount'
  | 'likeCount'
  | 'reportCount'
  | 'bookmarkCount';

/** 貼文分析資料（前端使用） */
export interface PostAnalytics {
  id: string;
  /** 會員帳號 */
  account: string;
  /** 用戶名稱 */
  userName: string;
  /** 貼文標題 */
  title: string;
  /** 貼文內容 */
  content: string;
  /** 圖片網址 */
  imageUrl: string;
  /** 留言數 */
  commentCount: number;
  /** 回覆數 */
  replyCount: number;
  /** 按讚數 */
  likeCount: number;
  /** 檢舉數 */
  reportCount: number;
  /** 收藏數 */
  bookmarkCount: number;
  /** 發佈時間 */
  timeAdded: string;
}

/** API 回傳的單筆貼文分析 */
export interface PostAnalyticsApiItem {
  tale_id: number;
  account: string;
  user_name: string;
  title: string;
  content: string;
  image_url: string;
  comments_count: number;
  replies_count: number;
  likes_count: number;
  reports_count: number;
  favorites_count: number;
  time_added: string;
}

/** API 回傳格式 */
export interface PostAnalyticsApiResponse {
  message: string;
  data: {
    items: PostAnalyticsApiItem[];
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
}

/** 排序狀態 */
export interface PostSortState {
  field: SortablePostField | null;
  direction: SortDirection;
}
