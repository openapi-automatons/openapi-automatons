import { ParsedUrlQueryInput } from "querystring";

const queryForm = (
  name: string,
  value:
    | string
    | number
    | Array<string | number>
    | { [key: string]: string | number },
  explode: boolean
): ParsedUrlQueryInput => {
  if (Array.isArray(value)) {
    if (explode) {
      return { [name]: value.map(String) };
    } else {
      return { [name]: value.join(",") };
    }
  } else if (value instanceof Object) {
    if (explode) {
      return value;
    } else {
      return {
        [name]: Object.entries(value)
          .map((prop: [string, string | number]) => prop.join(","))
          .join(","),
      };
    }
  } else {
    return { [name]: value };
  }
};

const querySpaceDelimited = (
  name: string,
  value:
    | string
    | number
    | Array<string | number>
    | { [key: string]: string | number }
): ParsedUrlQueryInput => {
  if (Array.isArray(value)) {
    return { [name]: value.join(" ") };
  } else if (value instanceof Object) {
    return {
      [name]: Object.entries(value)
        .map((prop: [string, string | number]) => prop.join(" "))
        .join(" "),
    };
  }
  throw new Error(`Unsupported value: ${name}`);
};

const queryPipeDelimited = (
  name: string,
  value:
    | string
    | number
    | Array<string | number>
    | { [key: string]: string | number }
): ParsedUrlQueryInput => {
  if (Array.isArray(value)) {
    return { [name]: value.join("|") };
  } else if (value instanceof Object) {
    return {
      [name]: Object.entries(value)
        .map((prop: [string, string | number]) => prop.join("|"))
        .join("|"),
    };
  }
  throw new Error(`Unsupported value: ${name}`);
};

const queryDeepObject = (
  name: string,
  value:
    | string
    | number
    | Array<string | number>
    | { [key: string]: string | number }
): ParsedUrlQueryInput => {
  if (!Array.isArray(value) && value instanceof Object) {
    return Object.keys(value).reduce(
      (pre, cur) => ({ ...pre, [`${name}[${cur}]`]: value[cur] }),
      {}
    );
  }
  throw new Error(`Unsupported value: ${name}`);
};

export const query = (
  name: string,
  value:
    | undefined
    | string
    | number
    | Array<string | number>
    | { [key: string]: string | number },
  style: "form" | "spaceDelimited" | "pipeDelimited" | "deepObject",
  explode: boolean
): ParsedUrlQueryInput => {
  if (value === undefined) return {};
  switch (style) {
    case "form":
      return queryForm(name, value, explode);
    case "spaceDelimited":
      return querySpaceDelimited(name, value);
    case "pipeDelimited":
      return queryPipeDelimited(name, value);
    case "deepObject":
      return queryDeepObject(name, value);
    default:
      throw new Error(`Unsupported style: ${style}`);
  }
};
