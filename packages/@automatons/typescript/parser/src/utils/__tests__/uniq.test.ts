import {uniq} from "../uniq";

it('should be uniq for array', () => {
  expect(uniq([{id: 1, value: '1'}, {id: 1, value: '2'}], 'id'))
    .toEqual([{id: 1, value: '1'}]);
});
