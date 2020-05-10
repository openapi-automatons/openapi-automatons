export const uniq = <T extends object>(items: T[], key: keyof T): T[] => items.reduce<T[]>(
  (pre, cur) => pre.some(item => cur[key] === item[key]) ? pre : [...pre, cur], [])
