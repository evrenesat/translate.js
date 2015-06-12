// Icelandic rules: Numbers ending in 1 are singular - unless ending in 11.
module.exports = function ( n/*, tarnslationKey*/ ) {
  return n===0 ? 0 : (n%10 !== 1 || n%100 === 11) ? 2 : 1;
};
