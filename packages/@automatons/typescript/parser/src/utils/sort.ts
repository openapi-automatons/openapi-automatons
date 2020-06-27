export const requiredCompare = (a: { required?: boolean }, b: { required?: boolean }) =>
  (a.required && b.required) || (!a.required && !b.required) ? 0 : b.required ? 1 : -1;
