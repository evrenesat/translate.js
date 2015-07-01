/* global require, describe, it */
var translate = require('./index');
var expect = require('expect.js');

describe('translate.js', function() {
  'use strict';

  var translationsObject = {

    plain: 'I like this.',
    like: 'I like {thing}!',
    simpleCounter: 'The count is {n}.',
    hits: {
      0: 'No Hits',
      1: '{n} Hit',
      2: '{n} Hitse',  //some slavic langs have multiple plural forms
      3: '{n} Hitses', //some slavic langs have multiple plural forms
      n: '{n} Hits'
    },
    icelandicSheep: {
      0: 'Engar kindur',
      1: '{n} kind', // some languages use singular for any number that ends with 1 (i.e. 101, 21, 31, 51)
      n: '{n} kindur',
      13: 'Baaahd luck!' // Aribtrary translation outside of pluralization rules
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

    'namespaceA::literalKey': 'Literal',
    'namespaceA::preferredKey': 'Preferred',

    namespaceA: {
      preferredKey: 'Ingored (superceded by literal key of same name)',

      plain: 'I like this.',
      like: 'I like {thing}!',
      simpleCounter: 'The count is {n}.',
      hits: {
        0: 'No Hits',
        1: '{n} Hit',
        2: '{n} Hitse',  //some slavic langs have multiple plural forms
        3: '{n} Hitses', //some slavic langs have multiple plural forms
        n: '{n} Hits'
      },
      icelandicSheep: {
        0: 'Engar kindur',
        1: '{n} kind', // some languages use singular for any number that ends with 1 (i.e. 101, 21, 31, 51)
        n: '{n} kindur',
        13: 'Baaahd luck!' // Aribtrary translation outside of pluralization rules
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

      'Prosa Key': 'This is prosa!'
    },

    comboCounter: '{name} is {n} years old.',
  };

  var t = translate( translationsObject );

  ['','namespaceA::'].forEach(function (ns) {
    var nsTitle = ns ? ' [namespace support]' : '';

    it('should return translationKey if no translation is found'+nsTitle, function () {
      expect( t(ns+'nonexistentkey') ).to.equal( ns+'nonexistentkey' );
    });

    it('should return a translated string'+nsTitle, function () {
      expect( t(ns+'plain') ).to.equal( 'I like this.' );
    });

    it('should return a translated string for prosa keys'+nsTitle, function () {
      expect( t(ns+'Prosa Key') ).to.equal( 'This is prosa!' );
    });

    it('should return a translated string and replace a placeholder '+nsTitle, function () {
      expect( t(ns+'like', {thing: 'Sun'}) ).to.equal( 'I like Sun!' );
    });

    it('should return a translated string and show missing placeholders'+nsTitle, function () {
      expect( t(ns+'like') ).to.equal( 'I like {thing}!' );
    });

    it('should return a translated string and replace a count'+nsTitle, function () {
      expect( t(ns+'simpleCounter', 25) ).to.equal( 'The count is 25.' );
    });

    it('should return a translated string with the correct plural form (0)'+nsTitle, function () {
      expect( t(ns+'hits', 0) ).to.equal( 'No Hits' );
    });

    it('should return a translated string with the correct plural form (1)'+nsTitle, function () {
      expect( t(ns+'hits', 1) ).to.equal( '1 Hit' );
    });

    it('should return a translated string with the correct plural form (2)'+nsTitle, function () {
      expect( t(ns+'hits', 2) ).to.equal( '2 Hitse' );
    });

    it('should return a translated string with the correct plural form (3)'+nsTitle, function () {
      expect( t(ns+'hits', 3) ).to.equal( '3 Hitses' );
    });

    it('should return a translated string with the correct plural form (4)'+nsTitle, function () {
      expect( t(ns+'hits', 4) ).to.equal( '4 Hits' );
    });

    it('should return a translated string with the correct plural form and replaced placeholders: t(key, replacements, count)'+nsTitle, function () {
      expect( t(ns+'date', {day: '13', year: 2014}, 2) ).to.equal( '13. February 2014' );
    });

    it('should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements)'+nsTitle, function () {
      expect( t(ns+'date', 2, {day: '13', year: 2014}) ).to.equal( '13. February 2014' );
    });

  });



  it('should support arbitrarily deep namespaces', function() {
    expect( t('namespaceA::icelandicSheep::13') ).to.equal( 'Baaahd luck!' );
  });


  var placeholders = { name:'Alice' };
  it('should handle combination of count and named placeholders', function () {
    expect( t('comboCounter', 10, placeholders) ).to.equal( 'Alice is 10 years old.' );
    expect( t('comboCounter', placeholders, 10) ).to.equal( 'Alice is 10 years old.' );
  });
  it('shouldn\'t modify the placeholder object', function () {
    expect( 'n' in placeholders ).to.equal( false );
  });

  it('should first check the existence of a literal key before entering namespaces', function () {
    expect( t('namespaceA::literalKey') ).to.equal( 'Literal' );
  });
  it('should prefer literal key over an existing namespaced key', function () {
    expect( t('namespaceA::preferredKey') ).to.equal( 'Preferred' );
  });


  var nonStringTranslations = {
    foo: 10,
    bar: [],
    baz: {},
    heh: null,
    ooh: true,
    happensToBeString: 'OK'
  };
  var t0 = translate( nonStringTranslations );
  it('should treat any non-string translations as missing', function () {
    expect( t0('foo') ).to.equal( 'foo' );
    expect( t0('bar') ).to.equal( 'bar' );
    expect( t0('baz') ).to.equal( 'baz' );
    expect( t0('heh') ).to.equal( 'heh' );
    expect( t0('ooh') ).to.equal( 'ooh' );
    expect( t0('happensToBeString') ).to.equal( 'OK' );
  });


  //every thing with namespace support + custom namespace splitter

  var t1 = translate( translationsObject, {namespaceSplitter: new RegExp('\\.')} );
  it('should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + RegExp splitter]', function() {
    expect( t1('namespaceA.date', 2, {day: '13', year: 2014}) ).to.equal( '13. February 2014' );
  });

  var t2 = translate( translationsObject, {namespaceSplitter: /\./} );
  it('should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + Inline RegExp splitter]', function() {
    expect( t2('namespaceA.date', 2, {day: '13', year: 2014}) ).to.equal( '13. February 2014' );
  });

  var t3 = translate( translationsObject, {namespaceSplitter: '.'} );
  it('should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + String splitter]', function() {
    expect( t3('namespaceA.date', 2, {day: '13', year: 2014}) ).to.equal( '13. February 2014' );
  });

  // custom isPlural function
  var pluralize_IS = function ( n /*, tarnslationKey*/ ) {
    // Icelandic rules: Numbers ending in 1 are singular - unless ending in 11.
    return (n%10 !== 1 || n%100 === 11) ? 2 : 1;
  };
  var t3b = translate( translationsObject, { pluralize: pluralize_IS } );
  ['','namespaceA::'].forEach(function (ns) {
    var nsTitle = ns ? ' [namespace support]' : '';

    it('should pluralize (0) correctly in Icelandic'+nsTitle, function () {
      expect( t3b(ns+'icelandicSheep', 0) ).to.equal( 'Engar kindur' );
    });
    it('should pluralize (1) correctly in Icelandic'+nsTitle, function () {
      expect( t3b(ns+'icelandicSheep', 1) ).to.equal( '1 kind' );
    });
    it('should pluralize (2) correctly in Icelandic'+nsTitle, function () {
      expect( t3b(ns+'icelandicSheep', 2) ).to.equal( '2 kindur' );
    });
    it('should pluralize (11) correctly in Icelandic'+nsTitle, function () {
      expect( t3b(ns+'icelandicSheep', 11) ).to.equal( '11 kindur' );
    });
    it('should pluralize (21) correctly in Icelandic'+nsTitle, function () {
      expect( t3b(ns+'icelandicSheep', 21) ).to.equal( '21 kind' );
    });
    it('should pluralize (29) correctly in Icelandic'+nsTitle, function () {
      expect( t3b(ns+'icelandicSheep', 29) ).to.equal( '29 kindur' );
    });
    it('should return explicit pluralization property regardless of pluralization function'+nsTitle, function () {
      expect( t5(ns+'icelandicSheep', 13) ).to.equal( 'Baaahd luck!' );
    });
    it('should automatically return correct pluralization for negative counts'+nsTitle, function () {
      expect( t5(ns+'icelandicSheep', -13) ).to.equal( 'Baaahd luck!' );
    });
  });

  // wrong arguments
  var t4 = translate( translationsObject, 'asd' );
  it('should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + wrong options arg]', function() {
    expect( t4('namespaceA::date', 2, {day: '13', year: 2014}) ).to.equal( '13. February 2014' );
  });


  //debug enabled
  var t5 = translate( translationsObject, {debug: true} );
  it('should return @@translationKey@@ if no translation is found and debug is true', function() {
    expect( t5('nonexistentkey') ).to.equal( '@@nonexistentkey@@' );
  });

  it('should return @@translationKey@@ if no translation is found [namespace support]', function() {
    expect( t5('namespaceA::nonexistentkey') ).to.equal( '@@namespaceA::nonexistentkey@@' );
  });


  var t6Keys = {
    fruit: '{0} apples, {1} oranges, {2} kiwis',
    bread: '{0} buns, {n} scones',
    items: {
      1: '{0} item ({n})',
      n: '{0} items ({n})'
    }
  };
  var t6 = translate( t6Keys );
  it('should accept placeholder values in arrays', function () {
    expect( t6('fruit', ['shiny', 'round']) ).to.equal( 'shiny apples, round oranges, {2} kiwis' );
  });
  it('should mix count and array placeholders', function () {
    expect( t6('bread', 7, [10]) ).to.equal( '10 buns, 7 scones' );
    expect( t6('bread', [7], 10) ).to.equal( '7 buns, 10 scones' );
  });
  it('should mix array placeholders and pluralization', function () {
    expect( t6('items', 1, ['Happy']) ).to.equal( 'Happy item (1)' );
    expect( t6('items', 7, ['Funny']) ).to.equal( 'Funny items (7)' );
  });



  var tXKeys = {
    name: 'English',
    ns: {
      x: {
        13: 'Thirteen',
        99: 'Ninety-nine',
        n:  'Default'
      }
    }
  };
  var tX;

  it('should gracefully handle no parameters', function () {
    tX= translate();
    expect( tX('name') ).to.equal( 'name' );
    expect( tX('ns::x',1) ).to.equal( 'ns::x' );
  });

  it('should gracefully handle nully (not falsey) parameters', function () {
    tX = translate(undefined, null);
    expect( tX('name') ).to.equal( 'name' );
    expect( tX('ns::x',1) ).to.equal( 'ns::x' );
  });

  it('should expose .keys and .opts properties', function () {
    expect( tX.keys ).to.be.an( 'object' );
    expect( tX.opts ).to.be.an( 'object' );
    expect( tX.keys ).to.eql( {} );
  });

  it('should allow late binding of translation keys', function () {
    tX.keys.foo = 'bar';
    expect( tX('foo') ).to.equal( 'bar' );
  });

  it('should allow late binding of translation keys', function () {
    tX.keys = tXKeys;
    expect( tX('foo') ).to.equal( 'foo' );
    expect( tX('name') ).to.equal( 'English' );
    expect( tX('ns::x',1) ).to.equal( 'Default' );
  });

  it('should allow late binding of pluralization', function () {
    tX.opts.pluralize = function (n) { return 99; };
    expect( tX('ns::x',1) ).to.equal( 'Ninety-nine' );
  });

  it('should allow late binding of namespaceSplitter', function () {
    tX.opts.namespaceSplitter = '__';
    expect( tX('ns__x',1) ).to.equal( 'Ninety-nine' );
  });

  it('should gracefully handle completely overloading the opts', function () {
    tX.opts = { pluralize: function (n) { return 13; } };
    expect( tX('ns::x',1) ).to.equal( 'Thirteen' );
  });

  it('should gracefully handle accidental removal of opts', function () {
    delete tX.opts; // Oops!
    expect( tX('ns::x',1) ).to.equal( 'Default' ); // no pluralization found
  });


  // it('should return ', function() {
  //  expect(t()).to.equal();
  // });
});
