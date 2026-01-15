export type User = {
    id?: number;
    email: string;
    password_hash: string;
    full_name?: string;
    role?: 'student' | 'instructor' | 'admin';
    is_verified?: boolean;
};
export declare function createUser(email: string, password_hash: string, full_name?: string): Promise<any>;
export declare function findByEmail(email: string): Promise<any>;
export declare function findById(id: number): Promise<any>;
export declare function saveRefreshToken(userId: number, token: string, expiresAt: string): Promise<void>;
export declare function findRefreshToken(token: string): Promise<any>;
export declare function removeRefreshToken(token: string): Promise<void>;
export declare function updatePassword(userId: number, password_hash: string): Promise<void>;
