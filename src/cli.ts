#!/usr/bin/env node
import chalk from 'chalk';
import ora from 'ora';
import {config} from './config';
import {generate} from './generate';

console.log(`${chalk.white('»')} ${chalk.gray(chalk`${config.name} {white v${config.version}}`)}`);

const spinner = ora('Generating');

spinner.start();
spinner.text = 'Read settings';
generate()
  .then((processes) => {
    const all: number = processes.length;
    let count: number = 0;
    return Promise.all(processes.map((promise) => promise.then(() => {
      count = count + 1;
      spinner.text = `Generating ${count}/${all}`;
    })));
  })
  .then(() => spinner.succeed('Generated'))
  .catch((e) => {
    spinner.fail(chalk.red('Generate failed'));
    console.error(e);
    process.exit(1);
  });
