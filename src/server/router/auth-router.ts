import { Application, Router as ExpressRouter } from 'express';

import { AbstractRouter } from './abstract-router';
import { EValidatorTypes, Validator, ValidatorBuilder } from '../validator';
import { TokenService } from '../service';
import {IApplicationModel} from "../../model/ApplicationModelInterface";
import {PasswordIncorrectError} from "../../util";
import {EUserRight, USER_TYPE_VALUES} from "../../entity/UserModel";

export class AuthRouter<T> extends AbstractRouter<T> {
  private router: ExpressRouter;

  private static readonly ROOT_ROUTE = '';
  private static readonly SIGN_IN_ROUTE = AuthRouter.ROOT_ROUTE + '/sign_in';
  private static readonly SIGN_OUT_ROUTE = AuthRouter.ROOT_ROUTE + '/sign_out';
  private static readonly SIGN_UP_ROUTE = AuthRouter.ROOT_ROUTE + '/sign_up';
  private static readonly GET_ME_ROUTE = AuthRouter.ROOT_ROUTE + '/me';

  private signInValidator: Validator;
  private signUpValidator: Validator;

  constructor(model: IApplicationModel<T>) {
    super(model);

    this.setupValidators();

    this.router = ExpressRouter();
    this.router.post(AuthRouter.SIGN_UP_ROUTE, this.signUpValidator.middleware(), this.signUp);
    this.router.post(AuthRouter.SIGN_IN_ROUTE, this.signInValidator.middleware(), this.signIn);
    this.router.post(AuthRouter.SIGN_OUT_ROUTE, this.signOut);
    this.router.get(AuthRouter.GET_ME_ROUTE, this.getMe);
  }

  setup(app: Application, baseUrl: string): void {
    app.use(baseUrl, this.router);
  }

  private signIn = async (req, res) => {
    try {
      const user = await this.model.getUserDAO().getUserByEmail(req.body.email);
      if (TokenService.getInstance().encodePassword(req.body.password) === user.password) {
        req.session.token = TokenService.getInstance().encodeToken({userId: user.id, right: user.right});
        AbstractRouter.handleJSONSuccess(user, res);
      } else {
        AbstractRouter.handleError(new PasswordIncorrectError(), res);
      }
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private signOut = async (req, res) => {
    try {
      if (req.session.token) {
        req.session.token = undefined;
        AbstractRouter.handleSuccess(res);
      } else {
        AbstractRouter.handleNotAuthenticated(res);
      }
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private signUp = async (req, res) => {
    try {
      const userCreateObject = {...req.body, password: TokenService.getInstance().encodePassword(req.body.password), right: EUserRight.OWNER};
      const user = await this.model.getUserDAO().addUser(userCreateObject);
      AbstractRouter.handleJSONSuccess(user, res);
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private getMe = async (req, res) => {
    try {
      const token = req.session.token;
      if (token) {
        const decoded = TokenService.getInstance().decodeToken(token);
        const user = await this.model.getUserDAO().getUserById(decoded.userId);
        AbstractRouter.handleJSONSuccess(user, res);
      } else {
        AbstractRouter.handleNotAuthenticated(res);
      }
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private setupValidators() {
    this.signInValidator = new ValidatorBuilder()
      .bodyMandatory({name: 'email', type: EValidatorTypes.STRING, minLength: 3})
      .bodyMandatory({name: 'password', type: EValidatorTypes.STRING, minLength: 6})
      .build();

    this.signUpValidator = new ValidatorBuilder()
      .bodyMandatory({name: 'email', type: EValidatorTypes.STRING, minLength: 3, maxLength: 32})
      .bodyMandatory({name: 'password', type: EValidatorTypes.STRING, minLength: 6})
      .bodyMandatory({name: 'firstName', type: EValidatorTypes.STRING, minLength: 2})
      .bodyMandatory({name: 'lastName', type: EValidatorTypes.STRING, minLength: 2})
      .bodyMandatory({name: 'type', type: EValidatorTypes.STRING, oneOf: USER_TYPE_VALUES})
      .build();
  }


}