import {readFile} from "fs-extra";
import paths from "../paths";
import {registerPartial} from "handlebars";
import glob from 'glob';

const convertName = (match: string) =>
  match.replace(`${paths.templates}/`, '')
    .replace('partials/', '')
    .replace('.hbs', '');

export const register = () => {
  return new Promise<string[]>((resolve, reject) =>
    glob('/**/partials/**/*.hbs',
      {root: paths.templates},
      (err, matches) => err ? reject(err) : resolve(matches)))
    .then(matches => matches.map<{ name: string, path: string }>(match =>
      ({name: convertName(match), path: match})))
    .then(files => {
      return files.map(({name, path}) => readFile(path, {encoding: 'utf-8'})
        .then(data => registerPartial(name, data)))
    });
};
