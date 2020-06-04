import {OpenapiReference} from "../types";

export const isRef = (schema: any): schema is OpenapiReference => schema.hasOwnProperty('$ref');
