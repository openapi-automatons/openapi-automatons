export const omitCopy = <T, S extends keyof T>(schema: T, key: S): Omit<T, S> =>
  Object.entries(schema)
    .reduce((pre, [name, value]) =>
      ({...pre, ...(name !== key ? {[name]: value} : {})}), {}) as Omit<T, S>
