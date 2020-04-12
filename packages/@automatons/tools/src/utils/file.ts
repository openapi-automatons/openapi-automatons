import {readFile as read} from 'fs';

export const readFile = (path: string) => new Promise<string>((resolve, reject) =>
  read(path, {encoding: 'utf-8'},
    (err, data) => err ? reject(err) : resolve(data)));
