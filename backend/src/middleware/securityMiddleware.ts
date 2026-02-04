import { Request, Response, NextFunction } from 'express';

const sanitizeNoSql = (obj: any) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (/^\$/.test(key)) {
        delete obj[key];
      } else {
        sanitizeNoSql(obj[key]);
      }
    }
  }
  return obj;
};

const sanitizeXss = (obj: any) => {
  if (typeof obj === 'string') {
    return obj.replace(/<[^>]*>/g, ''); // Simple strip tags
  }
  if (obj instanceof Object) {
    for (const key in obj) {
      obj[key] = sanitizeXss(obj[key]);
    }
  }
  return obj;
};

export const mongoSanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeNoSql(req.body);
  }
  if (req.params) {
    req.params = sanitizeNoSql(req.params);
  }
  next();
};

export const xssSanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeXss(req.body);
  }
  if (req.params) {
    req.params = sanitizeXss(req.params);
  }
  next();
};
