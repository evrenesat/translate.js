[![Build Status](https://travis-ci.org/StephanHoyer/translate.js.svg)](https://travis-ci.org/StephanHoyer/translate.js)
[![Dependency Status](https://david-dm.org/stephanhoyer/translate.js.svg)](https://david-dm.org/stephanhoyer/translate.js)
[![devDependency Status](https://david-dm.org/stephanhoyer/translate.js/dev-status.svg)](https://david-dm.org/stephanhoyer/translate.js#info=devDependencies)
[![rethink.js](https://img.shields.io/badge/rethink-js-yellow.svg)](https://github.com/rethinkjs/manifest)

translate.js
============

Javascript micro library for translations (i18n) with support for placeholders and multiple plural forms.


Installation:
------

```sh
npm install translate.js
```

Usage:
------

```JavaScript
var translate = require('translate.js');

var messages = {
  translationKey: 'translationValue'
};

var options = {
    // These are the defaults:
    debug: false, //[Boolean]: Logs missing translations to console and add "@@" around output if `true`.
    namespaceSplitter: '::',  // [String|RegExp]: Customizes the translationKey namespace splitter.
    pluralize: function(n,translKey){ return Math.abs(n); }  //[Function(count,translationKey)]: Provides a custom pluralization mapping function.
};

var t = translate(messages, [options]);

t('translationKey');
t('translationKey', count);
t('translationKey', {replaceKey: 'replacevalue'});
t('translationKey', count, {replaceKey: 'replacevalue'});
t('translationKey', {replaceKey: 'replacevalue'}, count);
t('moduleA::translationKey');

```

Example:
--------

First create a language specific object for your translations:

```JavaScript
var messages = {
    like: 'I like this.',
    likeThing: 'I like {thing}!',
    like01: 'I like {0} and {1}!',
    simpleCounter: 'The count is {n}.',
    hits: {
        0: 'No Hits',
        1: '{n} Hit',
        2: '{n} Hitse',  //some slavic langs have multiple plural forms
        3: '{n} Hitses', //some slavic langs have multiple plural forms
        n: '{n} Hits' // default
    },
    date: {
        1: '{day}. January {year}',
        2: '{day}. February {year}',
        3: '{day}. March {year}',
        4: '{day}. April {year}',
        5: '{day}. May {year}',
        6: '{day}. June {year}',
        7: '{day}. July {year}',
        8: '{day}. August {year}',
        9: '{day}. September {year}',
        10: '{day}. October {year}',
        11: '{day}. November {year}',
        12: '{day}. December {year}'
    },

    'Prosa Key': 'This is prosa!',  

    namespaceA: {
        like: 'I like this namespace.',
    }
}
```

Then bind the translation function to something short:
```JavaScript
var translate = require('translate.js');
var t = translate(messages)
```

And use it like this:
```JavaScript
//simple
t('like') => 'I like this.'
t('Prosa Key') => 'This is prosa!'

//namespace support
t('namespaceA::like') => 'I like this namespace.'

//palceholders - named
t('likeThing', {thing: 'the Sun'}) => 'I like the Sun!'
//palceholders - array
t('like01', ['Alice', 'Bob']) => 'I like Alice and Bob!'

//count
t('simpleCounter', 25) => 'The count is 25'
t('hits', 0) => 'No Hits'
t('hits', 1) => '1 Hit'
t('hits', 3) => '3 Hitses'
t('hits', 99) => '99 Hits'

//combined count and placeholders
t('date', 2, {day: '13', year: 2014}) => '13. February 2014'
```

It is flexible, so you can add/replace translations after the fact by modifying the `.keys` property, like so:

```js
t.keys['add-key'] = 'Sorry I am late!';
t('add-key'); => 'Sorry I am late!'

t.keys = { 'new-key': 'All is new!' };
t('new-key'); => 'All is new!'
t('add-key'); => 'add-key' (No longer translated)
t('like') => 'like'        (No longer translated)
```

The translation options can similarily be changed or replaced via the `.opts` property.

```js
t.opts.namespaceSplitter = '/';
t.keys.foo = { bar:'baz' }
t('foo/bar'); => 'baz'
```

Immutability can be achieved with a simple wrapper:

```js
var t2 = function () { return t.apply(null,arguments); };
```


### Custom pluralization

You can also do customized pluralization like this:

```js
var messages_IS = {
    sheep: {
        0: 'Engar kindur',
        13: 'Baaahd luck!'
        s: '{n} kind',
        p: '{n} kindur',
    }
};
var pluralize_IS = function ( n, tarnslationKey ) {
    // Icelandic rules: Numbers ending in 1 are singular - unless ending in 11.
    return (n%10 !== 1 || n%100 === 11) ? 'p' : 's';
};
var t = translate( messages_IS, { pluralize:pluralize_IS });

t('sheep', 0) => 'Engar kindur'
t('sheep', 1) => '1 kind'
t('sheep', 2) => '2 kindur'
t('sheep', 21) => '21 kind'
t('sheep', 13) => 'Baaahd luck'  // explicit translation takes precedence 
```

Translate.js comes with a predefined `pluralize` functions for [several languages](pluralize/). These can be required into your code as needed, like so:

```js
var pluralize_IS = require('translate.js/pluralize/is');
var t = translate( messages_IS, { pluralize:pluralize_IS  });
```

Here's a large list of [pluralization algorithms by language](http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms).

## namespace-Support

Namespace support was dropped in version 0.3.0 since it can easily be
accomplished without

With namespace support (old):
```
messages = {
  namespaceA: {
    foo: 'bar'
  }
}

t('namespaceA::foo');
```

Without namespace support (new):
```
messages = {
  'namespaceA::foo': 'bar'
}

t('namespaceA::foo');
```

If you really need it, use version 0.2.2.
