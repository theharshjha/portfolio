#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
    .scriptName('til')
    .commandDir('commands')
    .demandCommand(1, 'You need to specify a command.')
    .help()
    .parse();