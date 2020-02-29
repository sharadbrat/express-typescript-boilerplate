import * as jwt from 'jsonwebtoken';
import { IUserToken } from './application-server.impl';
import { AbstractRouter } from './router';

export function authenticationMiddleware(secret: string) {
  return (req, res, next) => {
    if (req.session.token) {
      const decoded = jwt.verify(req.session.token, secret, {algorithms: ['HS256']}) as IUserToken;
      if (decoded.userId) {
        next();
      } else {
        AbstractRouter.handleNotAuthenticated(res);
      }
    } else {
      AbstractRouter.handleNotAuthenticated(res);
    }
  }
}
