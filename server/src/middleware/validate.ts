import { Request, Response, NextFunction } from 'express';

export function requireFields(...fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const f of fields) {
      if (req.body[f] === undefined || req.body[f] === null) {
        return res.status(400).json({ error: `Missing field ${f}` });
      }
    }
    next();
  };
}

export function simpleEmailValidator(field = 'email') {
  return (req: Request, res: Response, next: NextFunction) => {
    const val = (req.body as any)[field];
    if (!val || typeof val !== 'string' || !/^\S+@\S+\.\S+$/.test(val)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    next();
  };
}

