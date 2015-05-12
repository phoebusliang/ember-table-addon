# Ember-CLI Addon for Ember Table

[![Build Status](https://travis-ci.org/hedgeserv/ember-table-addon.svg?branch=master)](https://travis-ci.org/hedgeserv/ember-table-addon)

This is an Ember-CLI wrapper around [Addepar's Ember Table.](https://github.com/Addepar/ember-table).

We'd like to gracefully port Ember Table to the Ember-CLI style, while
supporting backward compatibility with apps that depend on the global
definitions of Ember Table.

## Phases

- [x] Phase 1: Simple wrapper which installs Ember Table and dependencies via bower
- [x] Phase 2: Replace {{table-component}} with an Ember-CLI style component
- [x] Phase 3: Allow importing with modules by creating an Ember-CLI structure, where each file simply exports its globally defined counterpart
- [x] Phase 4: Rewrite demo app in Ember CLI style with Javascript
- [x] Phase 5: Move in actual source files and rewrite into Javascript
- [x] Phase 6: Support global style via a separate file that exports all the globals
- [x] Phase 7: Miscellaneous improvements marked by FIXME tags in the codebase

The rationale for this multi-step upgrade is to reduce risk and keep the
library functional in non-ember-cli apps.

## Installing in your Ember CLI app 

* `npm install --save-dev ember-table`
* `ember g ember-table`

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

## How this addon was created

This addon was created from scratch initially, using `ember addon ember-table --blueprint`.
It was then renamed to `ember-table-addon`.
