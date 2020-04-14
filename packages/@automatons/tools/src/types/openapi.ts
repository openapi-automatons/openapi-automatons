export interface Openapi {
  openapi: string;
  info: OpenapiInfo;
  servers?: OpenapiServer[];
  tags?: OpenapiTag[];
  paths: OpenapiMap<OpenapiPath>
  components?: OpenapiComponents;
  security?: OpenapiSecurity[];
  externalDocs?: OpenapiExternalDocument;
}

export interface OpenapiMap<T> {
  [key: string]: T
}

export interface OpenapiInfo {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: OpenapiInfoContact;
  license?: OpenapiInfoLicense;
}

export interface OpenapiInfoContact {
  name: string;
  url?: string;
}

export interface OpenapiInfoLicense {
  name: string;
  url?: string;
}

export interface OpenapiServer {
  url: string;
  description?: string;
  variables?: OpenapiMap<OpenapiServerVariable>;
}

export interface OpenapiServerVariable {
  default: string;
  description?: string;
  enum: string[];
}

export interface OpenapiExternalDocument {
  url: string;
  description?: string;
}

export interface OpenapiTag {
  name: string;
  description?: string;
  externalDocs?: OpenapiExternalDocument;
}

export interface OpenapiSecurity {
  [key: string]: string[]
}

export interface OpenapiPath {
}

export interface OpenapiComponents {
  schemas?: OpenapiMap<OpenapiSchema>
  responses?: {};
  parameters?: {};
  examples?: {};
  requestBodies?: {};
  headers?: {};
  securitySchemes?: {};
  links?: {};
  callbacks?: {};
}

export type OpenapiSchema = OpenapiSchemaString
  | OpenapiSchemaBoolean
  | OpenapiSchemaNumber
  | OpenapiSchemaInteger
  | OpenapiSchemaObject
  | OpenapiSchemaArray
  | OpenapiSchemaAllOf
  | OpenapiSchemaOneOf
  | OpenapiReference;

export interface OpenapiSchemaString extends OpenapiSchemaCommon {
  type: 'string';
  format?: 'date' | 'date-time' | 'password' | 'byte' | 'binary' | string
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];
}

export interface OpenapiReference extends OpenapiSchemaCommon {
  '$ref': string;
}

export interface OpenapiSchemaBoolean extends OpenapiSchemaCommon {
  type: 'boolean';
}

export interface OpenapiSchemaNumber extends OpenapiSchemaCommon {
  type: 'number';
  format?: 'float' | 'double' | string;
  enum?: number[];
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
}

export interface OpenapiSchemaInteger extends OpenapiSchemaCommon {
  type: 'integer';
  format?: 'int32' | 'int64' | string;
  enum?: number[];
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
}

export interface OpenapiSchemaObject extends OpenapiSchemaCommon {
  type: 'object';
  required?: string[];
  minProperties?: number;
  maxProperties?: number;
  properties?: OpenapiMap<OpenapiSchema>;
  additionalProperties?: true | OpenapiSchema
}

export interface OpenapiSchemaArray extends OpenapiSchemaCommon {
  type: 'array';
  uniqueItems?: boolean;
  minItems?: number;
  maxItems?: number;
  items?: OpenapiSchema;
}

export interface OpenapiSchemaAllOf extends OpenapiSchemaCommon {
  allOf: OpenapiSchema[]
}

export interface OpenapiSchemaOneOf extends OpenapiSchemaCommon {
  oneOf: OpenapiSchema[];
  discriminator?: {
    propertyName: string;
    mapping?: {
      [key: string]: string;
    }
  };
}

export interface OpenapiSchemaCommon {
  title?: string;
  description?: string;
  default?: any;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  externalDocs?: OpenapiExternalDocument;
  deprecated?: boolean;
  examples?: any;
}
