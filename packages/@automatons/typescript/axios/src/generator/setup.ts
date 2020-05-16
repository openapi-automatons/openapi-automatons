import helpers from "handlebars-helpers";
import HB from "handlebars";
import {register} from "./register";

helpers({handlebars: HB});
export const setup = () => {
  return register();
};
