var path = require('path')

module.exports = {
  rules: require('requireindex')(path.resolve(__dirname, 'rules')),
  rulesConfig: {
    'double-semi': 2
  }
}
