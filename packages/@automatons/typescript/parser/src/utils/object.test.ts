import {insert} from "./object";

describe('utils', () => {
  it('should be object insert.', () => {
    expect(insert({}, ['one', 'two', 'three'], 'four'))
      .toEqual({
        one: {
          two: {
            three: 'four'
          }
        }
      })
  });
  it('should be object merge insert.', () => {
    expect(insert({ one: {five: 'x'}}, ['one', 'two', 'three'], 'four'))
      .toEqual({
        one: {
          five: 'x',
          two: {
            three: 'four'
          }
        }
      })
  });
});
