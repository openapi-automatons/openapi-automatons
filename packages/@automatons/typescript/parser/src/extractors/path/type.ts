import {AutomatonContext} from "@automatons/tools/dist";
import {CookieParameter, HeaderParameter, Model, Path, PathParameter, QueryParameter} from "../../types";

export type PathContext = { path: string } & AutomatonContext;
export type ParameterResult = {
  parameters: PathParameter[],
  queries: QueryParameter[],
  headers: HeaderParameter[],
  cookies: CookieParameter[],
  models: Model[],
  imports: Model[]
};
export type PathReturn = { tags: string[], path: Path, models: Model[], imports: Model[] };
