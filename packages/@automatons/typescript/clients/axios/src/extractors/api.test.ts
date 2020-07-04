import {extractApiMeta} from "./api";

it('should extract meta', () => {
  expect(extractApiMeta({
    title: 'test',
    filename: 'test',
    servers: [],
    imports: [],
    paths: []
  }))
    .toEqual({hasQuery: false, hasTemplate: false, hasFormData: false});
  expect(extractApiMeta({
    title: 'test',
    filename: 'test',
    servers: [{name: 'test', url: 'test', values: [{name: '', defaultValue: '', enums: []}]}],
    imports: [],
    paths: []
  }))
    .toEqual({hasQuery: false, hasTemplate: true, hasFormData: false});
  expect(extractApiMeta({
    title: 'test',
    filename: 'test',
    servers: [],
    imports: [],
    paths: [{
      name: '',
      method: 'get',
      path: '',
      queries: [{name: 'test', schema: {type: 'string'}, style: 'form'}],
      servers: []
    }]
  }))
    .toEqual({hasQuery: true, hasTemplate: false, hasFormData: false});
  expect(extractApiMeta({
    title: 'test',
    filename: 'test',
    servers: [],
    imports: [],
    paths: [{
      name: '',
      method: 'post',
      path: '',
      forms: [{types: ['application/json'], schema: {type: 'string'}}],
      queries: [],
      servers: []
    }]
  }))
    .toEqual({hasQuery: false, hasTemplate: false, hasFormData: true});
});
