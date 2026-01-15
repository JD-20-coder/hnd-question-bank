import { Request, Response, NextFunction } from 'express';
export declare function requireFields(...fields: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare function simpleEmailValidator(field?: string): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
