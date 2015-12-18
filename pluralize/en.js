// English rules: Only 1 is singular
module.exports = function (n /*, tarnslationKey*/) {
  return n !== 1 ? 'p' : 's'
}
