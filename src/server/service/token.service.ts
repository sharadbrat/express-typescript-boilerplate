import crypto from "crypto";
import jwt from 'jsonwebtoken';

import { IUserToken } from '../application-server.impl';
import { ConfigurationService } from './configuration.service';

export class TokenService {
  private static instance: TokenService;

  private constructor() {
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  encodeToken(token: IUserToken) {
    const tokenSecret = ConfigurationService.getInstance().getConfig().http.tokenSecret;
    return jwt.sign(token, tokenSecret, {algorithm: 'HS256'});
  }

  decodeToken(token: string): IUserToken {
    const tokenSecret = ConfigurationService.getInstance().getConfig().http.tokenSecret;
    return jwt.verify(token, tokenSecret, {algorithms: ['HS256']}) as IUserToken;
  }

  encodePassword(password: string) {
    return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
  }

}
