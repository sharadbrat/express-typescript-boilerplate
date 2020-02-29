import { RequestHandler, Request } from 'express';

import { AbstractRouter } from './router';
import {FieldContractViolationError} from "../util";

export enum EValidatorTypes {
  STRING = 'string',
  NUMBER = 'number',
  ARRAY = 'array',
  BOOLEAN = 'boolean',
}

export interface IValidatorProperty {
  name: string;
  type?: EValidatorTypes;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  oneOf?: any[];
  items?: IValidatorProperty[];
}

export interface IValidatorOptions {
  body: {
    mandatory: IValidatorProperty[];
    optional: IValidatorProperty[];
  },
  path: {
    mandatory: IValidatorProperty[];
    optional: IValidatorProperty[];
  },
  query: {
    mandatory: IValidatorProperty[];
    optional: IValidatorProperty[];
  },
}

export class ValidatorBuilder {
  options: IValidatorOptions;

  constructor() {
    this.options = {
      body: {
        mandatory: [],
        optional: [],
      },
      path: {
        mandatory: [],
        optional: [],
      },
      query: {
        mandatory: [],
        optional: []
      }
    };
  }

  bodyMandatory(property: IValidatorProperty): ValidatorBuilder {
    return this.addProperty('body', 'mandatory', property);
  }

  bodyOptional(property: IValidatorProperty): ValidatorBuilder {
    return this.addProperty('body', 'optional', property);
  }

  pathMandatory(property: IValidatorProperty): ValidatorBuilder {
    return this.addProperty('path', 'mandatory', property);
  }

  pathOptional(property: IValidatorProperty): ValidatorBuilder {
    return this.addProperty('path', 'optional', property);
  }

  queryMandatory(property: IValidatorProperty): ValidatorBuilder {
    return this.addProperty('query', 'mandatory', property);
  }

  queryOptional(property: IValidatorProperty): ValidatorBuilder {
    return this.addProperty('query', 'optional', property);
  }

  build(): Validator {
    return new Validator(this.options);
  }

  private addProperty(place: 'query' | 'path' | 'body', type: 'mandatory' | 'optional', property: IValidatorProperty): ValidatorBuilder {
    this.options[place][type].push(property);
    return this;
  }
}

export class Validator {
  private options: IValidatorOptions;

  constructor(options: IValidatorOptions) {
    this.options = options;
  }

  validate(request: Request): Error[] {
    let errors = [];

    this.options.body.mandatory.forEach(el => {
      const err = this.validateMandatory(el, request.body[el.name]);
      errors = [...errors, ...err];
    });

    this.options.path.mandatory.forEach(el => {
      const err = this.validateMandatory(el, request.params[el.name]);
      errors = [...errors, ...err];
    });

    this.options.query.mandatory.forEach(el => {
      const err = this.validateMandatory(el, request.query[el.name]);
      errors = [...errors, ...err];
    });

    this.options.body.optional.forEach(el => {
      const err = this.validateOptional(el, request.body[el.name]);
      errors = [...errors, ...err];
    });

    this.options.path.optional.forEach(el => {
      const err = this.validateOptional(el, request.params[el.name]);
      errors = [...errors, ...err];
    });

    this.options.query.optional.forEach(el => {
      const err = this.validateOptional(el, request.query[el.name]);
      errors = [...errors, ...err];
    });

    return errors;
  }

  middleware(): RequestHandler {
    return (req, res, next) => {
      const errors = this.validate(req);
      if (errors.length > 0) {
        AbstractRouter.handleValidationErrors(errors, res);
      } else {
        next();
      }
    };
  }

  private validateMandatory(el: IValidatorProperty, prop: any): Error[] {
    if (prop === undefined || prop === null) {
      return [new FieldContractViolationError(el.name, 'field is mandatory')];
    }

    return this.validateOptional(el, prop);
  }

  private validateOptional(el: IValidatorProperty, prop: any) {
    if (prop) {
      let errors = [];

      if (!this.validateType(el.type, prop)) {
        errors.push(new FieldContractViolationError(el.name, `must have (${el.type}) type`))
      }

      if (!this.validateMinLength(el.minLength, prop)) {
        errors.push(new FieldContractViolationError(el.name, `length must be more or equal than (${el.minLength})`))
      }

      if (!this.validateMaxLength(el.maxLength, prop)) {
        errors.push(new FieldContractViolationError(el.name, `length must be less or equal than (${el.maxLength})`))
      }

      if (!this.validateMinSize(el.min, prop)) {
        errors.push(new FieldContractViolationError(el.name, `size must be more or equal than (${el.min})`))
      }

      if (!this.validateMaxSize(el.max, prop)) {
        errors.push(new FieldContractViolationError(el.name, `size must be less or equal than (${el.max})`))
      }

      if (!this.validateOneOf(el.oneOf, prop)) {
        errors.push(new FieldContractViolationError(el.name, `must be one of the following values: (${el.oneOf.join(', ')})`))
      }

      if (el.items && el.items.length) {
        errors = [
          ...errors,
          ...this.validateItems(el.items, prop, el.name)
        ];
      }

      return errors;
    } else {
      return [];
    }
  }

  private validateType(type: EValidatorTypes, prop: any): boolean {
    if (type) {
      if (type === EValidatorTypes.STRING) {
        return typeof prop === type;
      } else if (type === EValidatorTypes.NUMBER) {
        const number = +prop;
        return typeof number === type && number === number;
      } else if (type === EValidatorTypes.ARRAY) {
        return prop instanceof Array;
      } else if (type === EValidatorTypes.BOOLEAN) {
        return typeof prop === 'boolean';
      }
    } else {
      return true;
    }
  }

  private validateMinLength(min: number, prop: any): boolean {
    if (typeof min === 'number') {
      if (!prop.length) {
        return false;
      }

      return prop.length >= min;
    } else {
      return true;
    }
  }

  private validateMaxLength(max: number, prop: any): boolean {
    if (typeof max === 'number') {
      if (!prop.length) {
        return false;
      }

      return prop.length <= max;
    } else {
      return true;
    }
  }

  private validateMinSize(min: number, prop: any): boolean {
    if (typeof min === 'number') {
      const number = +prop;

      if (!(typeof number === 'number' && number === number)) {
        return false;
      }

      return prop >= min;
    } else {
      return true;
    }
  }

  private validateMaxSize(max: number, prop: any): boolean {
    if (typeof max === 'number') {
      const number = +prop;

      if (!(typeof number === 'number' && number === number)) {
        return false;
      }

      return prop <= max;
    } else {
      return true;
    }
  }

  private validateOneOf(arr: any[], prop): boolean {
    if (!(arr && arr instanceof Array)) {
      return true;
    }

    return !!arr.find(el => el === prop);
  }

  private validateItems(items: IValidatorProperty[], prop: any[], name: string): Error[] {
    if (!(prop && prop.length && prop instanceof Array)) {
      return [new FieldContractViolationError(name, 'must be an array')];
    }

    let errors = [];


    prop.forEach(el => {
      Object.keys(el).forEach(k => {
        const found = items.filter(el => el.name === k);
        if (found) {
          found.forEach(founded => {
            errors = [
              ...errors,
              ...this.validateMandatory(founded, el[k])
            ];
          });
        }
      });
    });

    return errors;
  }
}
