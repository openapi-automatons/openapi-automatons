import {omitCopy} from "../omitCopy";

it('should be omit copy', () => {
  expect(omitCopy({key: 'test'}, 'key'))
    .toEqual({});
});
