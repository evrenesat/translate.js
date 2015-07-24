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

/* global console, module */
(function(){
  'use strict';

  var isObject = function(obj) {
    return obj  &&  typeof obj === 'object';
  };

  var translatejs = function(messageObject, options) {

    var debug = options && options.debug;

    function getTranslationValue(translationKey) {
      var transValue = tFunc.keys[translationKey];
      if( transValue == null ) {
        var path = translationKey.split( (tFunc.opts && tFunc.opts.namespaceSplitter) || '::' );
        var i = 0;
        var len = path.length;
        if ( len > 1 )
        {
          // Start walking
          transValue = tFunc.keys;
          while ( len > i ) {
            transValue = transValue[ path[i] || '' ];
            if ( transValue == null ) {
              break;
            }
            i++;
          }
        }
      }
      return transValue;
    }


    function getPluralValue(translation, count) {
      // Opinionated assumption: Pluralization rules are the same for negative and positive values.
      // By normalizing all values to positive, pluralization functions become simpler, and less error-prone by accident.
      var mappedCount = Math.abs(count);

      if(translation[mappedCount] != null){
        translation = translation[mappedCount];
      } else {
        var plFunc = (tFunc.opts||{}).pluralize;
        mappedCount = plFunc ? plFunc( mappedCount, translation ) : mappedCount;
        if(translation[mappedCount] != null){
          translation = translation[mappedCount];
        } else if(translation.n != null) {
          translation = translation.n;
        } else {
          debug && console.warn('No plural forms found for "' + count + '" in', translation);
        }
      }
      return translation;
    }


    var replCache = {};
    var compile = function (bits) {
      var len = bits.length;
      return function (replacements,count) {
        var result = '';
        var isText = true;
        var i = 0;
        while ( i < len ) {
          var bit = bits[i];
          if ( isText ) {
            result += bit;
          } else {
            var val = replacements[bit];
            if ( val === undefined )
            {
              if ( bit==='n'  &&  count != null ) {
                val = count;
              } else {
                debug && console.warn('No "' + bit + '" in placeholder object:', replacements);
                val = '{'+bit+'}';
              }
            }
            result += val;
          }
          isText = !isText;
          i++;
        }
        return result;
      };
    };

    function replacePlaceholders(translation, replacements, count) {
      var result = replCache[translation];
      if ( result === undefined ) {
        var bits = translation.replace(/\{(\w+)\}/g, '{x}$1{x}').split('{x}'); // stupid but works
        result = replCache[translation] = bits.length > 1 ? compile(bits) : bits[0];
      }
      result = result.apply ? result(replacements, count) : result;
      return result;
    }

    var tFunc = function (translationKey, count, replacements) {
      var translation = getTranslationValue(translationKey);
      var complex = count!==undefined || replacements!==undefined;

      if ( complex )
      {
        if ( isObject(count) ) {
          var tmp = replacements;
          replacements = count;
          count = tmp;
        }
        replacements = replacements || {};
        count = typeof count === 'number' ? count : null;

        if ( count != null && isObject(translation) ) {
          //get appropriate plural translation string
          translation = getPluralValue(translation, count);
        }
      }

      if ( typeof translation !== 'string' ) {
        translation = translationKey;
        if (debug) {
            translation = '@@' + translation + '@@';
            console.warn('Translation for "' + translationKey + '" not found.');
        }
      } else if ( complex || debug ) {
        translation = replacePlaceholders(translation, replacements, count);
      }

      return translation;
    };

    tFunc.keys = messageObject || {};
    tFunc.opts = options || {};


    return tFunc;
  };


  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = translatejs;
  } else {
    window.translatejs = translatejs;
  }

})();
