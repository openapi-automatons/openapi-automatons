type OMap<T> = {
  [key: string]: T
}

export type Openapi = {
  openapi: string;
  info: OpenapiInfo;
  servers?: OpenapiServer[];
  tags?: OpenapiTag[];
  paths: OMap<OpenapiPath>
  components?: OpenapiComponents;
  security?: OpenapiSecurity[];
  externalDocs?: OpenapiExternalDocument;
}

type OpenapiInfo = {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: OpenapiInfoContact;
  license?: OpenapiInfoLicense;
};

type OpenapiInfoContact = {
  name: string;
  url?: string;
}

type OpenapiInfoLicense = {
  name: string;
  url?: string;
}

type OpenapiServer = {
  url: string;
  description?: string;
  variables?: OMap<OpenapiServerVariable>;
}

type OpenapiServerVariable = {
  default: string;
  description?: string;
  enums: string[];
}

type OpenapiExternalDocument = {
  url: string;
  description?: string;
}

type OpenapiTag = {
  name: string;
  description?: string;
  externalDocs?: OpenapiExternalDocument;
}

type OpenapiSecurity = {
  [key: string]: string[]
};

type OpenapiPath = {};

type OpenapiComponents = {
  schemas?: OMap<OpenapiSchema>
  responses?: {};
  parameters?: {};
  examples?: {};
  requestBodies?: {};
  headers?: {};
  securitySchemes?: {};
  links?: {};
  callbacks?: {};
};

export const isReference = (obj: object): obj is OpenapiReference =>
  obj.hasOwnProperty('$ref');

type OpenapiReference = {
  '$ref': string;
}

type OpenapiSchema = OpenapiSchemaString
  | OpenapiSchemaBoolean
  | OpenapiSchemaNumber
  | OpenapiSchemaInteger
  | OpenapiSchemaObject
  | OpenapiSchemaArray
  | OpenapiSchemaAllOf
  | OpenapiSchemaOneOf
  | OpenapiReference;

type OpenapiSchemaString = {
  type: 'string';
  format?: 'date' | 'date-time' | 'password' | 'byte' | 'binary' | string
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enums?: string[];
} & OpenapiSchemaCommon;

type OpenapiSchemaBoolean = {
  type: 'boolean';
} & OpenapiSchemaCommon;

type OpenapiSchemaNumber = {
  type: 'number';
  format?: 'float' | 'double' | string;
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
} & OpenapiSchemaCommon;

type OpenapiSchemaInteger = {
  type: 'integer';
  format?: 'int32' | 'int64' | string
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
} & OpenapiSchemaCommon;

type OpenapiSchemaObject = {
  type: 'object';
  required?: string[];
  minProperties?: number;
  maxProperties?: number;
  properties?: OMap<OpenapiSchema>;
  additionalProperties?: true | OpenapiSchema
} & OpenapiSchemaCommon;

type OpenapiSchemaArray = {
  type: 'array';
  uniqueItems?: boolean;
  minItems?: number;
  maxItems?: number;
  items: OpenapiSchema | OpenapiSchema[];
} & OpenapiSchemaCommon;

type OpenapiSchemaAllOf = {
  allOf: OpenapiSchema[]
} & OpenapiSchemaCommon;

type OpenapiSchemaOneOf = {
  oneOf: OpenapiSchema[];
  discriminator?: {
    propertyName: string;
    mapping?: {
      [key: string]: string;
    }
  };
} & OpenapiSchemaCommon;

type OpenapiSchemaCommon = {
  title?: string;
  default?: any;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  externalDocs?: OpenapiExternalDocument;
  deprecated?: boolean;
  example?: any;
};
