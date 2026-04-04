export interface User{
    id: number;
    name: string;
    email: string;
    birthday: string;
    country: string;
    avatar_url: string;
    background_url: string;
    membership_type: string;
    is_banned: boolean;
    time_added: string;
    time_modified: string;
}

export interface UserListResponse {
    message: string;
    data:{
        items:User[];
        page: number;
        size: number;
        total: number;
    }
}

// ==========================================
// Report 相關型別
// ==========================================

export interface ReportUser {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    background_url: string;
    apple_id: string;
    membership_type: string;
    privacy_tales: boolean;
    privacy_cotales: boolean;
    privacy_favorites: boolean;
    is_banned: boolean;
    time_added: string;
    time_modified: string;
}

export interface Report {
    id: number;
    reporter_id: number;
    report_type: string;
    target_id: number;
    reason: string;
    status: string;
    time_added: string;
    time_modified: string;
    reporter: ReportUser;
}

export interface ReportListResponse {
    message: string;
    data: {
        items: Report[];
        page: number;
        size: number;
        total: number;
    };
}

export interface ReportTargetInfo {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    is_banned: boolean;
    time_added: string;
}

export interface ReportDetailResponse {
    message: string;
    data: {
        report: Report;
        target_info: ReportTargetInfo;
    };
}

export interface UserDetailListResponse {
    message: string;
    data:{
        user_id: number;
        name: string;
        birthday: string;
        email: string;
        country: string;
        gender: string;
        time_added: string;
        phone: string;
        avatar_url: string;
        background_url: string;
        membership_type: string;
        tales_count: number;
        personal_completed_count: number;
        personal_uncompleted_count: number;
    }
}