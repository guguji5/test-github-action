var shell = require('shelljs');

shell.config.silent = false;
shell.config.verbose = false;

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

shell.exec('wget https://github.com/n9e/fe-v5/archive/refs/heads/master.zip')

shell.exec('unzip master.zip -d fe-v5')

shell.exec('ls')

shell.exec('ls fe-v5')
