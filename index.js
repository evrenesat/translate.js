/**
 * Microlib for translations with support for placeholders and multiple plural forms.
 *
 * v0.0.2
 *
 * Usage:
 * var messages = {
 *  translationKey: 'translationValue',
 *  moduleA: {
 *    translationKey: 'value123'
 *  }
 * }
 *
 * var options = {
 *   // These are the defaults:
 *   debug: false, //[Boolean]: Logs missing translations to console and add "@@" around output if `true`.
 *   namespaceSplitter: '::', //[String|RegExp]: Customizes the translationKey namespace splitter.
 *   pluralize: function(n,translKey){ return Math.abs(n); } //[Function(count,translationKey)]: Provides a custom pluralization mapping function.
 * }
 *
 * var t = libTranslate.getTranslationFunction(messages, [options])
 *
 * t('translationKey')
 * t('translationKey', count)
 * t('translationKey', {replaceKey: 'replacevalue'})
 * t('translationKey', count, {replaceKey: 'replacevalue'})
 * t('translationKey', {replaceKey: 'replacevalue'}, count)
 * t('moduleA::translationKey')
 *
 *
 * @author Jonas Girnatis <dermusterknabe@gmail.com>
 * @licence May be freely distributed under the MIT license.
 */

'use strict';

var isNumeric = function(obj) {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};

var isObject = function(obj) {
  return typeof obj === 'object' && obj !== null;
};

var isString = function(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

module.exports = function(messageObject, options) {
  options = isObject(options) ? options : {};

  var debug = options.debug;
  var namespaceSplitter = options.namespaceSplitter || '::';

  function getTranslationValue(translationKey) {
    if(messageObject[translationKey]) {
      return messageObject[translationKey];
    }

    //@todo make this more robust. maybe support more levels?
    var components = translationKey.split(namespaceSplitter);
    var namespace = components[0];
    var key = components[1];

    if(messageObject[namespace] && messageObject[namespace][key]) {
      return messageObject[namespace][key];
    }

    return null;
  }

  function getPluralValue(translation, count) {
    if (isObject(translation)) {
      if(Object.keys(translation).length === 0) {
        debug && console.log('[Translation] No plural forms found.');
        return null;
      }
      // Opinionated assumption: Pluralization rules are the same for negative and positive values.
      // By normalizing all values to positive, pluralization functions become simpler, and less error-prone by accident.
      var mappedCount = Math.abs(count);

      if(translation[mappedCount] != null){
        translation = translation[mappedCount];
      } else {
        mappedCount = options.pluralize ? options.pluralize( mappedCount, translation ) : mappedCount;
        if(translation[mappedCount] != null){
          translation = translation[mappedCount];
        } else if(translation.n != null) {
          translation = translation.n;
        } else {
          debug && console.log('[Translation] No plural forms found for count:"' + count + '" in', translation);
          translation = translation[Object.keys(translation).reverse()[0]];
        }
      }
    }

    return translation;
  }

  function replacePlaceholders(translation, replacements) {
    if (isString(translation)) {
      return translation.replace(/\{(\w*)\}/g, function (match, key) {
        if(!replacements.hasOwnProperty(key)) {
          debug && console.log('Could not find replacement "' + key + '" in provided replacements object:', replacements);

          return '{' + key + '}';
        }

        return replacements.hasOwnProperty(key) ? replacements[key] : key;
      });
    }

    return translation;
  }

  return function (translationKey) {
    var replacements = isObject(arguments[1]) ? arguments[1] : (isObject(arguments[2]) ? arguments[2] : {});
    var count = isNumeric(arguments[1]) ? arguments[1] : (isNumeric(arguments[2]) ? arguments[2] : null);

    var translation = getTranslationValue(translationKey);

    if (count !== null) {
      replacements.n = replacements.n ? replacements.n : count;

      //get appropriate plural translation string
      translation = getPluralValue(translation, count);
    }

    //replace {placeholders}
    translation = replacePlaceholders(translation, replacements);

    if (translation === null) {
      translation = debug ? '@@' + translationKey + '@@' : translationKey;

      if (debug) {
          console.log('Translation for "' + translationKey + '" not found.');
      }
    }

    return translation;
  };
};
