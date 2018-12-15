const Generator = require('yeoman-generator');
const userName = require('git-user-name');
const uniqid = require('uniqid');
const { mkdir } = require('shelljs');
const { writeFileSync } = require('fs');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    mkdir('-p', './changelogs/unreleased/');
  }

  async prompting () {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'author',
        message: `Author`,
        default: userName()
      },
      {
        type: 'list',
        name: 'type',
        message: 'Type of change?',
        choices: ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'],
        default: this.options.type
      },
      {
        type: 'input',
        name: 'change',
        message: `What's change?`,
        validate: text => text.trim().length ? true : 'This field is required'
      }
    ]);

    writeFileSync(`./changelogs/unreleased/${uniqid(answers.type + '-')}.json`, JSON.stringify(answers, null, 2));
  };
}