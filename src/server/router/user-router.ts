import { Application, Router as ExpressRouter } from 'express';
import crypto from 'crypto';

import { AbstractRouter } from './abstract-router';
import { EValidatorTypes, Validator, ValidatorBuilder } from '../validator';
import { TokenService } from '../service';
import {IApplicationModel} from "../../model/ApplicationModelInterface";
import {SUB_USER_RIGHT_VALUES, USER_TYPE_VALUES} from "../../entity/UserModel";

export class UserRouter<T> extends AbstractRouter<T> {
  private router: ExpressRouter;

  private static readonly ROOT_ROUTE = '';
  private static readonly USER_BY_ID_ROUTE = UserRouter.ROOT_ROUTE + '/:id';

  private getUserByIdValidator: Validator;
  private editUserValidator: Validator;
  private addUserValidator: Validator;

  constructor(model: IApplicationModel<T>) {
    super(model);

    this.setupValidators();

    this.router = ExpressRouter();
    this.router.get(UserRouter.USER_BY_ID_ROUTE, this.getUserByIdValidator.middleware(), this.getUserById);
    this.router.put(UserRouter.USER_BY_ID_ROUTE, this.editUserValidator.middleware(), this.editUser);
    this.router.post(UserRouter.ROOT_ROUTE, this.addUserValidator.middleware(), this.addUser);
    this.router.delete(UserRouter.USER_BY_ID_ROUTE, this.getUserByIdValidator.middleware(), this.deleteUser);
  }

  setup(app: Application, baseUrl: string): void {
    app.use(baseUrl, this.router);
  }

  // todo Add permissions
  private getUserById = async (req, res) => {
    try {
      const user = await this.model.getUserDAO().getUserById(req.params.id);
      AbstractRouter.handleJSONSuccess(user, res);
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private editUser = async (req, res) => {
    try {
      const body = req.body;

      if (req.body.password) {
        body.password = TokenService.getInstance().encodePassword(req.body.password);
      }

      const user = await this.model.getUserDAO().modifyUser(req.params.id, req.body);
      AbstractRouter.handleJSONSuccess(user, res);
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private deleteUser = async (req, res) => {
    try {
      const user = await this.model.getUserDAO().deleteUser(req.params.id);
      AbstractRouter.handleJSONSuccess(user, res);
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private addUser = async (req, res) => {
    try {
      const decoded = TokenService.getInstance().decodeToken(req.session.token);

      const userCreateObject = {
        ...req.body,
        password: this.encodePassword(req.body.password),
        bossId: decoded.userId
      };
      const user = await this.model.getUserDAO().addUser(userCreateObject);
      AbstractRouter.handleJSONSuccess(user, res);
    } catch (err) {
      AbstractRouter.handleError(err, res);
    }
  };

  private setupValidators() {
    this.getUserByIdValidator = new ValidatorBuilder()
      .pathMandatory({name: 'id', type: EValidatorTypes.STRING, minLength: 3})
      .build();

    this.editUserValidator = new ValidatorBuilder()
      .pathMandatory({name: 'id', type: EValidatorTypes.STRING, minLength: 3})
      .bodyOptional({name: 'email', type: EValidatorTypes.STRING, minLength: 3, maxLength: 32})
      .bodyOptional({name: 'password', type: EValidatorTypes.STRING, minLength: 6})
      .bodyOptional({name: 'firstName', type: EValidatorTypes.STRING, minLength: 2})
      .bodyOptional({name: 'lastName', type: EValidatorTypes.STRING, minLength: 2})
      .bodyOptional({name: 'right', type: EValidatorTypes.STRING, oneOf: SUB_USER_RIGHT_VALUES})
      .bodyOptional({name: 'type', type: EValidatorTypes.STRING, oneOf: USER_TYPE_VALUES})
      .build();

    this.addUserValidator = new ValidatorBuilder()
      .bodyMandatory({name: 'email', type: EValidatorTypes.STRING, minLength: 3, maxLength: 32})
      .bodyMandatory({name: 'password', type: EValidatorTypes.STRING, minLength: 6})
      .bodyMandatory({name: 'firstName', type: EValidatorTypes.STRING, minLength: 2})
      .bodyMandatory({name: 'lastName', type: EValidatorTypes.STRING, minLength: 2})
      .bodyMandatory({name: 'right', type: EValidatorTypes.STRING, oneOf: SUB_USER_RIGHT_VALUES})
      .bodyMandatory({name: 'type', type: EValidatorTypes.STRING, oneOf: USER_TYPE_VALUES})
      .build();
  }

  private encodePassword(password: string) {
    return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
  }
}
