# Ember-CLI Addon for Ember Table

This is an Ember-CLI wrapper around [Addepar's Ember Table.](https://github.com/Addepar/ember-table).

We'd like to gracefully port Ember Table to the Ember-CLI style, while
supporting backward compatibility with apps that depend on the global
definitions of Ember Table.

## Phases

[ ] Phase 1: Simple wrapper which installs Ember Table and dependencies via bower
[ ] Phase 2: Replace {{table-component}} with an Ember-CLI style component
[ ] Phase 3: Allow importing with modules by creating an Ember-CLI structure, where each file simply exports its globally defined counterpart
[ ] Phase 4: Rewrite source files into javascript
[ ] Phase 5: Move the code to module structure, and support global style via a separate file that exports all the globals
[ ] Phase 6: Port remaining parts of the app to Ember-CLI style

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
