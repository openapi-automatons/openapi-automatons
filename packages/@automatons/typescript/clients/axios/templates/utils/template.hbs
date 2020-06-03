const templateSimple = (explode: boolean, value: string | number | Array<string | number> | { [p: string]: string | number }): string => {
  if (!explode) {
    return value instanceof Object
      ? Array.isArray(value)
        ? value.join(',') : Object.entries(value).map(prop => prop.join(',')).flat().join(',')
      : String(value);
  }
  return value instanceof Object
    ? Array.isArray(value)
      ? value.join(',') : Object.entries(value).map(([key, value]) => `${key}=${value}`).flat().join(',')
    : String(value);
}

const templateLabel = (explode: boolean, value: string | number | Array<string | number> | { [p: string]: string | number }): string => {
  if (!explode) {
    return `.${value instanceof Object
      ? Array.isArray(value)
        ? value.join(',') : Object.entries(value).map(prop => prop.join(',')).flat().join(',')
      : String(value)}`;
  }
  return value instanceof Object
    ? Array.isArray(value)
      ? value.join(',') : Object.entries(value).map(([key, value]) => `${key}=${value}`).flat().join(',')
    : String(value);
}

const templateMatrix = (explode: boolean, name: string, value: string | number | Array<string | number> | { [p: string]: string | number }): string => {
  if (!explode) {
    return `;${name}=${value instanceof Object
      ? Array.isArray(value)
        ? value.join(',') : Object.entries(value).map(prop => prop.join(',')).flat().join(',')
      : String(value)}`;
  }
  return `;${value instanceof Object
    ? Array.isArray(value)
      ? value.map(item => `${name}=${item}`).join(';')
      : Object.entries(value).map(([key, value]) => `${key}=${value}`).flat().join(';')
    : `${name}=${String(value)}`}`;
}

export const template =
  (
    name: string,
    value: string | number | Array<string | number> | { [key: string]: string | number },
    style: 'simple' | 'label' | 'matrix',
    explode: boolean): string => {
    if (style === 'simple') {
      return templateSimple(explode, value);
    } else if (style === 'label') {
      return templateLabel(explode, value);
    } else if (style === 'matrix') {
      return templateMatrix(explode, name, value);
    }
    throw new Error(`Unsupported style: ${style}`)
  }
