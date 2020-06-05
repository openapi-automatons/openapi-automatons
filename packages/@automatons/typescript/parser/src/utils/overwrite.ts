export const overwrite = <T>(items: T[], item: T, predicate: (item: T) => boolean): T[] =>
  [...(items.filter(predicate)), item];
