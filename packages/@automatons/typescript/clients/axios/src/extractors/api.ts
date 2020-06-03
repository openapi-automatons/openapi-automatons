import {Api} from "@automatons/typescript-parser";

export const extractApiMeta = (api: Api) => {
  const hasTemplate = api.servers.some(server => server.values?.length)
    || api.paths.some(path => path.parameters?.length)
    || api.paths.some(path => path.headers?.length);
  const hasQuery = api.paths.some(path => path.queries?.length)
    || api.paths.some(path => path.cookies?.length);
  return {hasQuery, hasTemplate};
};
