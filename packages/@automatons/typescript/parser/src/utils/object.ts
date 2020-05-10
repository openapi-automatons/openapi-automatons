export const insert = <T extends object>(obj: any, keys: string[], value: any): T => {
  const result = obj;
  let tmp = result;
  keys.forEach((key, index) => {
    if (keys.length <= index + 1) (tmp[key] = value)
    else {
      if (!tmp?.[key]) (tmp[key] = {})
      tmp = tmp[key];
    }
  })
  return result as T;
}
