import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { ValidatorException } from '../exceptions/ValidatorException';

@Service()
@Middleware({ type: 'after' })
export class AppErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: any, res: any, next: (err?: any) => any) {
    const statusCode: number = error?.httpCode || 500;
    const resObj: any = {};

    // Class validator handle errors
    if (statusCode === 400) {
      if (typeof error === 'object' && error.hasOwnProperty('errors')) {
        let validatorErrors = {} as any;
        error.errors.forEach((element: any) => {
          if (element.property && element.constraints) {
            validatorErrors[element.property] = Object.values(element.constraints);
          }
        });
        resObj.fields = validatorErrors;
      }
      if (typeof error === 'object' && error instanceof ValidatorException) {
        resObj[typeof error.data === 'string' ? 'nonFields' : 'fields'] = error.data;
      }
    }

    res.status(statusCode);
    res.json(resObj);
  }
}
