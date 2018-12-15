# Generator Changelog

## Introduction

A simple helper to generate changelog.md file. Inspired by [Gitlab changelog entries](https://docs.gitlab.com/ce/development/changelog.html).

Create unreleased changelogs entries, then, on release, group all an generate a changelog.md file.

## Code Samples

### Create new entry on unreleased changes

Just run `yo changelog` on your console.

```console
foo@bar:~$ yo changelog

? Author Yuri Titi
? Type of change? Added
? What's change? Generator to update changelog.md file
```

### Generate changelog.md

Just run `yo changelog:generate` on your console.

This will ask you version then update `changelog.md` and `package.json`

```console
foo@bar:~$ yo changelog:generate

? Version 1.0.0
```

## Installation

```console
foo@bar:~$ npm install -g yo generator-changelog
```