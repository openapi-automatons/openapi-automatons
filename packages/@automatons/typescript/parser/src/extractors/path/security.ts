import {Security} from "../../types";
import {convertSecurity} from "../../converters/security";
import {Openapi, OpenapiPathOperation} from "@automatons/tools/dist";

export const extractSecurity = (operation: OpenapiPathOperation, openapi: Openapi): Security[] | undefined =>
  operation.security && operation.security.map(value =>
    Object.entries(value)
      .map<Security | undefined>(([name, scopes]): Security | undefined => {
        const security = openapi.components?.securitySchemes?.[name];
        return security ? convertSecurity(name, security, scopes) : undefined;
      }).filter<Security>((value): value is Security => value !== undefined)).flat();
