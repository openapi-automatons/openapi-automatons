import {Security} from "../types";
import {OpenapiSecuritySchema} from "@automatons/tools/dist";
import { pascalCase } from "change-case";

export const convertSecurity = (name: string, security: OpenapiSecuritySchema, scopes: string[]): Security | undefined => {
  switch (security.type) {
    case 'oauth2':
      return {...security, name: pascalCase(name), scopes};
    case 'apiKey':
      return {...security, name: pascalCase(name), key: security.name}
    case 'http':
    case 'openIdConnect':
      return {...security, name: pascalCase(name)}
    default:
      return undefined;
  }
};
