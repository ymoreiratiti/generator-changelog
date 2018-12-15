const Generator = require('yeoman-generator');
const _ = require('lodash');
const { mkdir } = require('shelljs');
const { readFileSync, readdirSync, writeFileSync, existsSync } = require('fs');
const path = require('path')
const semver = require('semver')
const shell = require('shelljs')

const unreleasedFolder = './changelogs/unreleased/'
let fileChangeLog = {};
let version = null

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    mkdir('-p', unreleasedFolder);
    if (existsSync('./changelogs/archive.json')) {
      fileChangeLog = JSON.parse(readFileSync('./changelogs/archive.json'))
    }
  }

  async prompting () {
    let packageJson = null
    if (existsSync('./package.json')) {
      packageJson = JSON.parse(readFileSync('./package.json'))
    }

    const answers = await this.prompt([
      {
        type: 'input',
        name: 'version',
        message: 'Version',
        default: packageJson ? packageJson.version : undefined,
        validate: text => semver.valid(text) ? true : 'Semver invalid'
      }
    ]);

    version = answers.version;
    let releaseDate = new Date().toISOString().split('T')[0];

    if (packageJson) {
      packageJson.version = version;
      writeFileSync(`./package.json`, JSON.stringify(packageJson, null, 2));
    }

    fileChangeLog[version] = fileChangeLog[version] || { version, releaseDate, changes: [] }
    fileChangeLog[version].releaseDate = releaseDate;
  };

  importUnreleased () {
    const newChanges = readdirSync(unreleasedFolder)
      .map(fileName => readFileSync(path.join(unreleasedFolder, fileName)))
      .map(JSON.parse)

    fileChangeLog[version].changes = fileChangeLog[version].changes.concat(newChanges)

    fileChangeLog = _(fileChangeLog).toPairs().sort((a, b) => semver.rcompare(a[0], b[0])).fromPairs().value();
    writeFileSync(`./changelogs/archive.json`, JSON.stringify(fileChangeLog, null, 2));
    shell.rm('-rf', unreleasedFolder);
  }

  generateMarkdownFile () {
    let fileString = '# Changelog \nAll notable changes to this project will be documented in this file.'

    Object.values(fileChangeLog).forEach(versionData => {

      fileString += `\n\n## [${versionData.version}] - ${versionData.releaseDate}\n`
      _(versionData.changes).sortBy(El => El.type).groupBy('type').toPairs().value().map(([type, lstChanges]) => {
        fileString += `\n### ${type}\n`
        fileString += lstChanges.map(El => `- ${El.change} by ${El.author}`).join('\n')
      })
    });

    writeFileSync(`changelog.md`, fileString);
  }
}