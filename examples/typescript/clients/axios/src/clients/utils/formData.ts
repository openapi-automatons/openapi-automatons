import { objectToFormData } from "object-to-formdata";

export const formData = <T = unknown>(type: string, form: T): T | FormData => {
  switch (type) {
    case "multipart/form-data":
      return objectToFormData(form);
    default:
      return form;
  }
};
