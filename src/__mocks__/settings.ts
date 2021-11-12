import automatons from '../__tests__/examples/automatons.json';

export const readSettings = jest.fn(() => Promise.resolve(automatons))
