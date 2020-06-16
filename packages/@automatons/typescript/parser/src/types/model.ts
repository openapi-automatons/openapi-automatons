interface MapArray {
  name: string;
  value: any;
}

export type Schema = StringSchema | NumberSchema | BooleanSchema | ArraySchema | ObjectSchema | AllOfSchema | OneOfSchema | ModelSchema;

export interface Model {
  title: string;
  filename: string;
  imports: Model[];
  schema: Schema;
}

export interface SchemaCommon {
  description?: string;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  examples?: MapArray[];
  defaultValue?: any;
}

export interface StringSchema extends SchemaCommon {
  type: 'string';
  format?: 'date' | 'date-time' | 'password' | 'byte' | 'binary' | 'url' | string;
  enum?: string[];
}

export interface NumberSchema extends SchemaCommon {
  type: 'number';
  format?: 'int32' | 'int64' | 'float' | 'double' | string;
  enum?: number[];
}

export interface BooleanSchema extends SchemaCommon {
  type: 'boolean';
}

export interface ObjectSchema extends SchemaCommon {
  type: 'object';
  properties?: Property[];
  enum?: object[];
}

export interface Property {
  name: string;
  required: boolean;
  schema: Schema;
}

export interface ArraySchema extends SchemaCommon {
  type: 'array';
  uniqueItems?: boolean;
  minItems?: number;
  maxItems?: number;
  items?: Schema;
  enum?: any[][];
}

export interface AllOfSchema extends SchemaCommon {
  type: 'allOf';
  schemas: Schema[];
}

export interface OneOfSchema extends SchemaCommon {
  type: 'oneOf';
  schemas: Schema[];
}

export interface ModelSchema extends SchemaCommon {
  type: 'model';
  model: string;
}

