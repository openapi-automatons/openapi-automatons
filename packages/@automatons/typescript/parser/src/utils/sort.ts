export const requiredCompare = (a: { required?: boolean }, b: { required?: boolean }) =>
  a.required === true && b.required === true ? 0 : b.required === true ? 1 : -1;
