import { Service } from 'typedi';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import express from 'express';

@Service()
@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    const resObject = {} as any;
    resObject.success = false;

    if (error instanceof HttpError && error.httpCode) {
      resObject.status = error.httpCode;
      res.status(resObject.status);
    } else {
      resObject.status = 500;
      res.status(resObject.status);
    }

    resObject.message = error?.message;

    if (error?.stack && process.env.NODE_ENV === 'development' && resObject.status === 500) {
      resObject.stack = error.stack;
    }

    res.json(resObject);
  }
}
