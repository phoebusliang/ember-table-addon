# Ember Table by Addepar Globals Build

There are some legacy apps which are not in ember-cli or ES6 modules style, and
expect some global objects to exist. The broccoli build in this file generates
those global objects.

## Installation

Add a bower dependency on ember-table and include
```
bower_components/ember-table/packaging/dist/ember-table.js
```
in your app.

## Building

* `cd packaging`
* `rm -r dist/`
* `broccoli build dist/`
