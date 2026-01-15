export declare function createQuestion(bankId: number, authorId: number | null, title: string, body: string, answer: string | null, type?: string, difficulty?: string, attachments?: any): Promise<any>;
export declare function getQuestionsByBank(bankId: number, limit?: number, offset?: number): Promise<any[]>;
export declare function getQuestionById(id: number): Promise<any>;
export declare function updateQuestion(id: number, fields: any): Promise<void>;
export declare function deleteQuestion(id: number): Promise<void>;
