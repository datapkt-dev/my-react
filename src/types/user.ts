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