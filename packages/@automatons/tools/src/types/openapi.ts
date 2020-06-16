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
  'x-name'?: string;
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
  '$ref'?: string;
  get?: OpenapiPathOperation;
  put?: OpenapiPathOperation;
  post?: OpenapiPathOperation;
  delete?: OpenapiPathOperation;
  options?: OpenapiPathOperation;
  head?: OpenapiPathOperation;
  patch?: OpenapiPathOperation;
  trace?: OpenapiPathOperation;
  servers?: OpenapiServer[];
  parameters?: OpenapiParameter[];
}

export type OpenapiParameter = OpenapiParameterPath
  | OpenapiParameterQuery
  | OpenapiParameterHeader
  | OpenapiParameterCookie
  | OpenapiReference;

export type OpenapiParameterCommon = {
  name: string;
  description?: string;
  deprecated?: string;
  explode?: boolean;
  example?: any;
  examples?: OpenapiMap<OpenapiExample>;
} & ({ content: OpenapiMap<OpenapiPathMedia> } | { schema: OpenapiSchema });

export type OpenapiParameterPath = {
  in: 'path';
  style: 'simple' | 'label' | 'matrix';
  required: true;
} & OpenapiParameterCommon;

export type OpenapiParameterQuery = {
  in: 'query';
  style: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
  required?: boolean;
  allowReserved?: boolean;
} & OpenapiParameterCommon;

export type OpenapiParameterHeader = {
  in: 'header';
  style: 'simple';
  required?: boolean;
} & OpenapiParameterCommon;

export type OpenapiParameterCookie = {
  in: 'cookie';
  style: 'form';
  required?: boolean;
} & OpenapiParameterCommon;

export interface OpenapiPathOperation extends OpenapiPathCommon {
  operationId: string;
  tags?: string[];
  externalDocs?: OpenapiExternalDocument;
  parameters?: OpenapiParameter[];
  requestBody?: OpenapiPathRequestBody | OpenapiReference;
  responses: OpenapiMap<OpenapiPathResponse | OpenapiReference>;
  callbacks?: OpenapiMap<OpenapiMap<OpenapiPathOperation>>;
  deprecated?: boolean;
  security?: OpenapiMap<string[]>[];
  servers?: OpenapiServer[];
}

export interface OpenapiPathRequestBody {
  content: OpenapiMap<OpenapiPathMedia>;
  description?: string;
  required?: boolean;
}

export type OpenapiPathResponse = {
  description: string;
  headers?: OpenapiMap<OpenapiPathResponseHeader | OpenapiReference>;
  content?: OpenapiMap<OpenapiPathMedia>;
  links?: OpenapiMap<OpenapiPathResponseLink | OpenapiReference>;
};

export interface OpenapiPathResponseHeader {
  description?: string;
  schema?: OpenapiSchema;
}

export type OpenapiPathMedia = {
  schema?: OpenapiSchema;
  encoding?: OpenapiMap<OpenapiPathResponseMediaEncoding>
} & ({ example?: any; } | { examples?: OpenapiMap<OpenapiExample> })

export type OpenapiExample = {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export interface OpenapiPathResponseMediaEncoding {
  contentType?: string;
  headers?: OpenapiMap<OpenapiPathResponseHeader | OpenapiReference>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface OpenapiPathResponseLink {
  operationRef?: string;
  operationId?: string;
  parameters?: OpenapiMap<any>;
  requestBody?: any;
  description?: string;
  server?: OpenapiServer;
}

export interface OpenapiPathCommon {
  summary?: string;
  description?: string;
}

export interface OpenapiComponents {
  schemas?: OpenapiMap<OpenapiSchema>
  responses?: {};
  parameters?: {};
  examples?: {};
  requestBodies?: {};
  headers?: {};
  securitySchemes?: OpenapiMap<OpenapiSecuritySchema>;
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
  | OpenapiSchemaReference;

export type OpenapiSchemaReference = OpenapiReference & OpenapiSchemaCommon;

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

export type OpenapiSecuritySchema = OpenapiSecurityApiKeySchema
  | OpenapiSecurityHttpSchema
  | OpenapiSecurityHttpBearerSchema
  | OpenapiSecurityOAuth2Schema
  | OpenapiSecurityOpenIdConnectSchema;

export interface OpenapiSecurityApiKeySchema {
  type: 'apiKey';
  description?: string;
  name: string;
  in: 'query' | 'header' | 'cookie';
}

export interface OpenapiSecurityHttpSchema {
  type: 'http';
  description?: string;
  scheme: 'basic';
}

export interface OpenapiSecurityHttpBearerSchema {
  type: 'http';
  description?: string;
  scheme: 'bearer';
  bearerFormat?: string;
}

export interface OpenapiSecurityOAuth2Schema {
  type: 'oauth2';
  description?: string;
  flow: {
    implicit?: OpenapiSecurityOAuthFlow;
    password?: OpenapiSecurityOAuthFlow;
    clientCredentials?: OpenapiSecurityOAuthFlow;
    authorizationCode?: OpenapiSecurityOAuthFlow;
  };
}

export interface OpenapiSecurityOAuthFlow {
  authorizationUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  scopes: OpenapiMap<string>;
}

export interface OpenapiSecurityOpenIdConnectSchema {
  type: 'openIdConnect';
  description?: string;
  openIdConnectUrl: string;
}
