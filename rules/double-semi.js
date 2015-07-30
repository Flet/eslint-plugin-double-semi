// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = function (context) {
  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  /**
   * Reports a semicolon error with appropriate location and message.
   * @param {ASTNode} node The node with an extra or missing semicolon.
   * @returns {void}
   */
  function report (node) {
    var message = 'Missing double semicolon.'
    context.report(node, context.getLastToken(node).loc.end, message)
  }

  /**
   * Checks whether a token is a semicolon punctuator.
   * @param {Token} token The token.
   * @returns {boolean} True if token is a semicolon punctuator.
   */
  function isSemicolon (token) {
    return (token.type === 'Punctuator' && token.value === ';')
  }

  function isDoubleSemicolon (lastToken) {
    // var isDivider, isOptOutToken, lastTokenLine, prevToken, nextTokenLine

    if (!isSemicolon(lastToken)) {
      return false
    }

    var nextToken = context.getTokenAfter(lastToken)

    if (!nextToken) {
      return false
    }

    return nextToken.value === ';'
  }

  /**
   * Checks a node to see if it's followed by a semicolon.
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkForSemicolon (node) {
    var lastToken = context.getLastToken(node)

    if (!isDoubleSemicolon(lastToken)) {
      report(node)
    }
  }

  /**
   * Checks to see if there's a semicolon after a variable declaration.
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkForSemicolonForVariableDeclaration (node) {
    var ancestors = context.getAncestors()
    var parentIndex = ancestors.length - 1
    var parent = ancestors[parentIndex]

    if ((parent.type !== 'ForStatement' || parent.init !== node) &&
      (!/^For(?:In|Of)Statement/.test(parent.type) || parent.left !== node)
    ) {
      checkForSemicolon(node)
    }
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  return {
    'VariableDeclaration': checkForSemicolonForVariableDeclaration,
    'ExpressionStatement': checkForSemicolon,
    'ReturnStatement': checkForSemicolon,
    'ThrowStatement': checkForSemicolon,
    'DebuggerStatement': checkForSemicolon,
    'BreakStatement': checkForSemicolon,
    'ContinueStatement': checkForSemicolon,
    'ImportDeclaration': checkForSemicolon,
    'ExportAllDeclaration': checkForSemicolon,
    'ExportNamedDeclaration': function (node) {
      if (!node.declaration) {
        checkForSemicolon(node)
      }
    },
    'ExportDefaultDeclaration': function (node) {
      if (!/(?:Class|Function)Declaration/.test(node.declaration.type)) {
        checkForSemicolon(node)
      }
    }
  }

}
