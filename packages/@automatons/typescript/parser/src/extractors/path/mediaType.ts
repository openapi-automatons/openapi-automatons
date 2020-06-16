import {OpenapiMap, OpenapiPathMedia} from "@automatons/tools/dist";

export const extractMediaType = (schema: OpenapiMap<OpenapiPathMedia>): keyof OpenapiMap<OpenapiPathMedia> =>
  schema.hasOwnProperty('application/json') ?
    'application/json' :
    schema.hasOwnProperty('application/*') ?
      'application/*' :
      schema.hasOwnProperty('default') ?
        'default' : Object.keys(schema)[0];
