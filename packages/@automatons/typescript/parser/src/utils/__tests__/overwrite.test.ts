import {overwrite} from "../overwrite";

it('should be overwrite to array', () => {
  expect(overwrite([{key: 'test'}], {key: 'test', value: 'overwrite'}, item => item.key !== 'test'))
    .toEqual([{key: 'test', value: 'overwrite'}]);
});
