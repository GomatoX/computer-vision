import Jasmine from 'jasmine';
import Reporter from 'jasmine-console-reporter';
import chalk from 'chalk';

var jasmine = new Jasmine();
jasmine.jasmine.getEnv().addReporter(new Reporter());
jasmine.onComplete(function(passed) {
  if (passed) {
    console.log(chalk.green('All specs have passed'));
  } else {
    console.log(chalk.red('At least one spec has failed'));
  }
});

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.execute();
