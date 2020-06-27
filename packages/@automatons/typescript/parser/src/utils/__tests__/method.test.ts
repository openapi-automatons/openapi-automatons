import {isReceive} from "../method";
import {Method} from "@automatons/tools";

it.each<[Method, boolean]>([
  ['get', true],
  ['put', false],
  ['post', false],
  ['delete', true],
  ['options', true],
  ['head', true],
  ['patch', false],
  ['trace', true]
])('should be judge method (%s is %s)', (method, expected) => {
  expect(isReceive(method))
    .toEqual(expected);
});
