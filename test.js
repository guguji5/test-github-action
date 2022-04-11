var shell = require('shelljs');

shell.config.silent = false;
shell.config.verbose = false;

shell.exec('wget https://github.com/n9e/fe-v5/archive/refs/heads/master.zip')

shell.exec('unzip master.zip')

shell.exec('ls')

