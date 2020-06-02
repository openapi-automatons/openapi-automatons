import helpers from "handlebars-helpers";
import HB from "handlebars";
import {register} from "./register";

HB.registerHelper('every', function <T extends Object>(value: T[], key: keyof T, text: T[keyof T]) {
  return value.every(item => (item[key] == undefined ? false : item[key]) === text)
});
helpers({handlebars: HB});
export const setup = () => {
  return register();
};
