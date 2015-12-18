// Icelandic rules: Numbers ending in 1 are singular - unless ending in 11.
module.exports = function (n /*, tarnslationKey*/) {
  return (n % 10 !== 1 || n % 100 === 11) ? 'p' : 's'
}
