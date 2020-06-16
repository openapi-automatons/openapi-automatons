import {Security} from "../types";
import {OpenapiSecuritySchema} from "@automatons/tools/dist";
import { camelCase } from "change-case";

export const convertSecurity = (name: string, security: OpenapiSecuritySchema, scopes: string[]): Security | undefined => {
  switch (security.type) {
    case 'oauth2':
      return {...security, name: camelCase(name), scopes};
    case 'apiKey':
      return {...security, name: camelCase(name), key: security.name}
    case 'http':
    case 'openIdConnect':
      return {...security, name: camelCase(name)}
    default:
      return undefined;
  }
};
