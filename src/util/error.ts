export class EntityByIdNotFoundError extends Error {
  constructor(entityName: string, id: string) {
    super(`Entity "${entityName}" with id: [${id}] was not found.`);
    this.name = 'EntityByIdNotFoundError';
  }
}

export class EntityByPropertyNotFoundError extends Error {
  constructor(entityName: string, propertyName: string, property: string) {
    super(`Entity "${entityName}" with ${propertyName}: [${property}] was not found.`);
    this.name = 'EntityByPropertyNotFoundError';
  }
}

export class EntityAlreadyExistsError extends Error {
  constructor(entityName: string, fieldName: string, fieldValue: string) {
    super(`Entity "${entityName}" with ${fieldName}: [${fieldValue}] already exists.`);
    this.name = 'EntityAlreadyExistsError';
  }
}

export class PasswordIncorrectError extends Error {
  constructor() {
    super(`Password is incorrect.`);
    this.name = 'PasswordIncorrectError';
  }
}

export class FieldsAreMandatoryError extends Error {
  constructor(method: string, fields: string[]) {
    super(`Method [${method}] requires json object in body with the following fields: [${fields.join(', ')}]`);
    this.name = 'FieldsAreMandatoryError';
  }
}

export class OneFieldIsMandatoryError extends Error {
  constructor(method: string, fields: string[]) {
    super(`Method [${method}] requires json object in body with at least one of the following fields: [${fields.join(', ')}]`);
    this.name = 'OneFieldIsMandatoryError';
  }
}

export class FieldContractViolationError extends Error {
  constructor(fieldName: string, requirements: string) {
    super(`Field [${fieldName}] was violated, expected to fulfil next requirements: [${requirements}]`);
    this.name = 'FieldContractViolationError';
  }
}

export class QueryParameterIsMandatoryError extends Error {
  constructor(param: string) {
    super(`Query parameter [${param}] is required to perform the operation`);
    this.name = 'QueryParameterIsMandatoryError';
  }
}
