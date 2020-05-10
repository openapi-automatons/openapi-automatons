import {OpenapiReference} from "@automatons/tools/dist";

export const isRef = (schema: any): schema is OpenapiReference => schema.hasOwnProperty('$ref');
