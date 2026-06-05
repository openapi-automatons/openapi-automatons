import {readFileSync} from 'node:fs';

export const config = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
