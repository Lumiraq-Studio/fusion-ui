export interface AuthResponse {
        access_token: string;
        userName: string;
        userId: number;
        role: string;
        permissions: string[];

}

export interface UserInfo {
    userName: string;
    userId: number;
    role: string;
    permissions: string[];
}