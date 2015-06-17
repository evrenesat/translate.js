var translate = require('./index');
var expect = require('expect.js');
describe("translate.js", function() {
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

	    namespaceA: {
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
	    }
	}

	var t = translate(translationsObject);

	it("should return @@translationKey@@ if no translation is found", function() {
		expect(t('nonexistentkey')).to.equal('@@nonexistentkey@@');
	});

	it("should return a translated string", function() {
		expect(t('plain')).to.equal('I like this.');
	});

	it("should return a translated string for prosa keys", function() {
		expect(t('Prosa Key')).to.equal('This is prosa!');
	});

	it("should return a translated string and replace a placeholder ", function() {
		expect(t('like', {thing: 'Sun'})).to.equal('I like Sun!');
	});

	it("should return a translated string and show missing placeholders", function() {
		expect(t('like')).to.equal('I like {thing}!');
	});

	it("should return a translated string and replace a count", function() {
		expect(t('simpleCounter', 25)).to.equal('The count is 25.');
	});

	it("should return a translated string with the correct plural form (0)", function() {
		expect(t('hits', 0)).to.equal('No Hits');
	});

	it("should return a translated string with the correct plural form (1)", function() {
		expect(t('hits', 1)).to.equal('1 Hit');
	});

	it("should return a translated string with the correct plural form (2)", function() {
		expect(t('hits', 2)).to.equal('2 Hitse');
	});

	it("should return a translated string with the correct plural form (3)", function() {
		expect(t('hits', 3)).to.equal('3 Hitses');
	});

	it("should return a translated string with the correct plural form (4)", function() {
		expect(t('hits', 4)).to.equal('4 Hits');
	});

	it("should return a translated string with the correct plural form and replaced placeholders: t(key, replacements, count)", function() {
		expect(t('date', {day: '13', year: 2014}, 2)).to.equal('13. February 2014');
	});

	it("should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements)", function() {
		expect(t('date', 2, {day: '13', year: 2014})).to.equal('13. February 2014');
	});


	//every thing with namespace support
	it("should return @@translationKey@@ if no translation is found [namespace support]", function() {
		expect(t('namespaceA::nonexistentkey')).to.equal('@@namespaceA::nonexistentkey@@');
	});

	it("should return a translated string [namespace support]", function() {
		expect(t('namespaceA::plain')).to.equal('I like this.');
	});

	it("should return a translated string for prosa keys  [namespace support]", function() {
		expect(t('namespaceA::Prosa Key')).to.equal('This is prosa!');
	});

	it("should return a translated string and replace a placeholder  [namespace support]", function() {
		expect(t('namespaceA::like', {thing: 'Sun'})).to.equal('I like Sun!');
	});

	it("should return a translated string and show missing placeholders [namespace support]", function() {
		expect(t('namespaceA::like')).to.equal('I like {thing}!');
	});

	it("should return a translated string and replace a count [namespace support]", function() {
		expect(t('namespaceA::simpleCounter', 25)).to.equal('The count is 25.');
	});

	it("should return a translated string with the correct plural form (0) [namespace support]", function() {
		expect(t('namespaceA::hits', 0)).to.equal('No Hits');
	});

	it("should return a translated string with the correct plural form (1) [namespace support]", function() {
		expect(t('namespaceA::hits', 1)).to.equal('1 Hit');
	});

	it("should return a translated string with the correct plural form (2) [namespace support]", function() {
		expect(t('namespaceA::hits', 2)).to.equal('2 Hitse');
	});

	it("should return a translated string with the correct plural form (3) [namespace support]", function() {
		expect(t('namespaceA::hits', 3)).to.equal('3 Hitses');
	});

	it("should return a translated string with the correct plural form (4) [namespace support]", function() {
		expect(t('namespaceA::hits', 4)).to.equal('4 Hits');
	});

	it("should return a translated string with the correct plural form and replaced placeholders: t(key, replacements, count) [namespace support]", function() {
		expect(t('namespaceA::date', {day: '13', year: 2014}, 2)).to.equal('13. February 2014');
	});

	it("should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support]", function() {
		expect(t('namespaceA::date', 2, {day: '13', year: 2014})).to.equal('13. February 2014');
	});

	//every thing with namespace support + custom namespace splitter

	var t1 = translate(translationsObject, {namespaceSplitter: new RegExp('\\.')});
	it("should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + RegExp splitter]", function() {
		expect(t1('namespaceA.date', 2, {day: '13', year: 2014})).to.equal('13. February 2014');
	});

	var t2 = translate(translationsObject, {namespaceSplitter: /\./});
	it("should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + Inline RegExp splitter]", function() {
		expect(t2('namespaceA.date', 2, {day: '13', year: 2014})).to.equal('13. February 2014');
	});

	var t3 = translate(translationsObject, {namespaceSplitter: '.'});
	it("should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + String splitter]", function() {
		expect(t3('namespaceA.date', 2, {day: '13', year: 2014})).to.equal('13. February 2014');
	});

	// custom isPlural function
	var pluralize_IS = function ( n, tarnslationKey ) {
    // Icelandic rules: Numbers ending in 1 are singular - unless ending in 11.
		return (n%10 !== 1 || n%100 === 11) ? 2 : 1;
	};
	var t3b = translate(translationsObject, { pluralize: pluralize_IS });
	['','namespaceA::'].forEach(function (ns) {
			var nsTitle = ns ? ' [namespace support]' : '';

			it('should pluralize (0) correctly in Icelandic'+nsTitle, function () {
				expect(t3b(ns+'icelandicSheep', 0)).to.equal('Engar kindur');
			});
			it('should pluralize (1) correctly in Icelandic'+nsTitle, function () {
				expect(t3b(ns+'icelandicSheep', 1)).to.equal('1 kind');
			});
			it('should pluralize (2) correctly in Icelandic'+nsTitle, function () {
				expect(t3b(ns+'icelandicSheep', 2)).to.equal('2 kindur');
			});
			it('should pluralize (11) correctly in Icelandic'+nsTitle, function () {
				expect(t3b(ns+'icelandicSheep', 11)).to.equal('11 kindur');
			});
			it('should pluralize (21) correctly in Icelandic'+nsTitle, function () {
				expect(t3b(ns+'icelandicSheep', 21)).to.equal('21 kind');
			});
			it('should pluralize (29) correctly in Icelandic'+nsTitle, function () {
				expect(t3b(ns+'icelandicSheep', 29)).to.equal('29 kindur');
			});
			it('should return explicit pluralization property regardless of pluralization function'+nsTitle, function () {
				expect(t5(ns+'icelandicSheep', 13)).to.equal('Baaahd luck!');
			});
			it('should automatically return correct pluralization for negative counts'+nsTitle, function () {
				expect(t5(ns+'icelandicSheep', -13)).to.equal('Baaahd luck!');
			});
		})

	//wrong arguments
	var t4 = translate(translationsObject, 'asd');
	it("should return a translated string with the correct plural form and replaced placeholders: t(key, count, replacements) [namespace support + wrong options arg]", function() {
		expect(t4('namespaceA::date', 2, {day: '13', year: 2014})).to.equal('13. February 2014');
	});


	//debug enabled
	var t5 = translate(translationsObject, {debug: true});
	it("should return @@translationKey@@ if no translation is found and debug is true", function() {
		expect(t5('nonexistentkey')).to.equal('@@nonexistentkey@@');
	});

	it("should return @@translationKey@@ if no translation is found [namespace support]", function() {
		expect(t5('namespaceA::nonexistentkey')).to.equal('@@namespaceA::nonexistentkey@@');
	});

	// it("should return ", function() {
	// 	expect(t()).to.equal();
	// });
});
