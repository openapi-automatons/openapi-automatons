import {OpenapiMap, OpenapiPathResponse, OpenapiReference} from "@automatons/tools/dist";

export const extractStatus = (schema: OpenapiMap<OpenapiPathResponse | OpenapiReference>): keyof OpenapiMap<OpenapiPathResponse | OpenapiReference> => {
  const statuses = Object.keys(schema);
  return statuses
    .map(status => Number(status))
    .filter(status => Number(status) >= 200 && Number(status) < 300)
    .sort()[0] ?? statuses[0];
}
