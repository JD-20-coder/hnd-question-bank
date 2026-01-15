export declare function createBank(title: string, description: string | null, ownerId: number | null): Promise<any>;
export declare function getBanks(limit?: number, offset?: number): Promise<any[]>;
export declare function getBankById(id: number): Promise<any>;
export declare function updateBank(id: number, title: string, description: string | null): Promise<void>;
export declare function deleteBank(id: number): Promise<void>;
