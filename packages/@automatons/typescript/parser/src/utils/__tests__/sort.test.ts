import {requiredCompare} from "../sort";

it.each<[{ required?: boolean }, { required?: boolean }, number]>([
  [{required: true}, {}, -1],
  [{}, {required: true}, 1],
  [{}, {}, 0],
  [{required: true}, {required: true}, 0],
  [{required: false}, {required: false}, 0],
  [{required: false}, {}, 0],
])
('should be required sort', (a, b, expected) => {
  expect(requiredCompare(a, b))
    .toEqual(expected);
});
