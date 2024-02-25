import { Service } from 'typedi';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { authConfig } from '../../config/auth';
import * as jwt from 'jsonwebtoken';

@Service()
export class AuthCheck implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next: (err?: any) => any): any {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).send({ message: 'Unauthorized!' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, authConfig.JwtSecret, (err: any, user: any) => {
      if (err) {
        return response.status(403).send({ message: 'Forbidden!' });
      }
      request.loggedInUser = user;
      next();
    });
  }
}
