import { Application, Response } from 'express';
import { IRoutes } from '../application-server.impl';
import {IApplicationModel} from "../../model/ApplicationModelInterface";
import {
  EntityAlreadyExistsError,
  EntityByIdNotFoundError,
  FieldContractViolationError,
  FieldsAreMandatoryError, OneFieldIsMandatoryError, PasswordIncorrectError
} from "../../util";



export abstract class AbstractRouter<T> {
  protected model: IApplicationModel<T>;

  constructor(model: IApplicationModel<T>) {
    this.model = model;
  }

  abstract setup(app: Application, baseUrl: string, routes: IRoutes): void;

  /**
   * Handle all possible errors that may appear in the runtime
   * @param err
   * @param res
   */
  static handleError(err: Error, res: Response) {
    if (err instanceof EntityByIdNotFoundError) {
      res.status(404);
    } else if (err instanceof EntityAlreadyExistsError) {
      res.status(400);
    } else if (err instanceof FieldsAreMandatoryError) {
      res.status(400);
    } else if (err instanceof FieldContractViolationError) {
      res.status(400);
    } else if (err instanceof OneFieldIsMandatoryError) {
      res.status(400);
    } else if (err instanceof PasswordIncorrectError) {
      res.status(401);
    } else {
      res.status(500);
    }
    const json = {
      name: err.name,
      message: err.message,
    };

    res.json(json).end();

    console.error(err);
  }

  /**
   * Handle validation errors
   * @param err
   * @param res
   */
  static handleValidationErrors(err: Error[], res: Response) {
    res.status(400);

    const json = {
      errors: err.map(el => ({name: el.name, message: el.message, stack: el.stack}))
    };

    res.json(json).end();
  }

  /**
   * Handle successful run of REST API method with JSON data to send
   * @param data
   * @param res
   */
  static handleJSONSuccess(data: object, res: Response) {
    res.status(200).json(data).end();
  }

  /**
   * Handle successful run of REST API method
   * @param res
   */
  static handleSuccess(res) {
    res.status(200).end();
  }

  /**
   * Handle not implemented REST API method
   * @param res
   * @param stub
   */
  static handleNotImplemented(res: Response, stub?: object) {
    if (stub) {
      res.json(stub);
    }

    res.status(501).end();
  }

  /**
   * Handle not authenticated case
   * @param res
   */
  static handleNotAuthenticated(res: Response) {
    res.status(401).end();
  }
}
