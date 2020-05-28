import {Security} from "../types";
import {OpenapiSecuritySchema} from "@automatons/tools/dist";

export const convertSecurity = (name: string, security: OpenapiSecuritySchema, scopes: string[]): Security | undefined => {
  switch (security.type) {
    case 'oauth2':
      return {...security, name, scopes};
    case 'apiKey':
      return {...security, name, key: security.name}
    case 'http':
    case 'openIdConnect':
      return {...security, name}
    default:
      return undefined;
  }
};
