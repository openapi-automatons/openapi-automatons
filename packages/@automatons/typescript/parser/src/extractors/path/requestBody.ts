import {
  AutomatonContext,
  OpenapiPathMedia,
  OpenapiPathRequestBody,
  OpenapiReference,
  OpenapiSchema,
  referenceSchema
} from "@automatons/tools/dist";
import {Form, Model} from "../../types";
import {extractSchema, ExtractSchemaResult} from "../schema";
import deepEqual from "deep-equal";

export const extractRequestBody = async (schema: OpenapiPathRequestBody | OpenapiReference, path: string, method: any, context: AutomatonContext) => {
  const requestBody = await referenceSchema(schema, context);
  const extracts = await Promise.all(Object.entries(requestBody.content)
    .filter<[string, OpenapiPathMedia & { schema: OpenapiSchema }]>((item): item is [string, OpenapiPathMedia & { schema: OpenapiSchema }] => !!item[1].schema)
    .map<Promise<{ key: string, required?: boolean, extract: ExtractSchemaResult }>>(async ([key, value]) => ({
      key,
      required: requestBody.required,
      extract: await extractSchema([...path.split('/'), method, ...key.split('/'), 'Request'].join(' '), value.schema, context)
    })));
  return extracts
    .map<{ form: Form, models: Model[], imports?: Model[] }>(({key, required, extract}) =>
      ({
        form: {types: [key], required, schema: extract.schema},
        models: extract.models,
        imports: extract.imports
      }))
    .reduce<{ forms: Form[], models: Model[], imports: Model[] }>((pre, cur) => ({
      forms: pre.forms.some(form => deepEqual(form.schema, cur.form.schema)) ? pre.forms.map(form => deepEqual(form.schema, cur.form.schema) ? {
        ...form,
        types: [...form.types, ...cur.form.types]
      } : form) : [...pre.forms, cur.form],
      models: [...pre.models, ...cur.models],
      imports: [...pre.imports, ...cur.imports ?? []]
    }), {forms: [], models: [], imports: []});
};
