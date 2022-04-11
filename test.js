var shell = require('shelljs');

shell.config.silent = false;
shell.config.verbose = false;

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

shell.exec('git pull git@github.com:n9e/fe-v5.git')