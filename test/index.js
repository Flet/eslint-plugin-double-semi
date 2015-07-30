/**
 * @fileoverview Tests for semi rule.
 * @author Nicholas C. Zakas
 */

'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint')
var ESLintTester = require('eslint-tester')

var msg = 'Missing double semicolon.'

var eslintTester = new ESLintTester(eslint.linter)
eslintTester.addRuleTest('rules/double-semi', {
  valid: [
    'var x = 5;;',
    'var x =5, y;;',
    'foo();;',
    'x = foo();;',
    'setTimeout(function() {foo = "bar";; });;',
    'setTimeout(function() {foo = "bar";;});;',
    'for (var a in b){}',
    'for (var i;;){}',
    'if (true) {}\n;;[global, extended].forEach(function(){});;',
    "throw new Error('foo');;",
    { code: 'for (let thing of {}) {\n  console.log(thing);;\n}', ecmaFeatures: { forOf: true, blockBindings: true }},

    // method definitions don't have a semicolon.
    { code: 'class A { a() {} b() {} }', ecmaFeatures: { classes: true }},
    { code: 'var A = class { a() {} b() {} };;', ecmaFeatures: { classes: true }},

    { code: "import theDefault, { named1, named2 } from 'src/mylib';;", ecmaFeatures: { modules: true }},

    { code: "export * from 'foo';;", ecmaFeatures: { modules: true } },
    { code: "export { foo } from 'foo';;", ecmaFeatures: { modules: true } },
    { code: 'export { foo };;', ecmaFeatures: { modules: true } },
    { code: 'export var foo;;', ecmaFeatures: { modules: true } },
    { code: 'export function foo () { }', ecmaFeatures: { modules: true } },
    { code: 'export function* foo () { }', ecmaFeatures: { generators: true, modules: true } },
    { code: 'export class Foo { }', ecmaFeatures: { classes: true, modules: true } },
    { code: 'export let foo;;', ecmaFeatures: { blockBindings: true, modules: true } },
    { code: 'export const FOO = 42;;', ecmaFeatures: { blockBindings: true, modules: true } },
    { code: 'export default function() { }', ecmaFeatures: { modules: true } },
    { code: 'export default function* () { }', ecmaFeatures: { generators: true, modules: true } },
    { code: 'export default class { }', ecmaFeatures: { classes: true, modules: true } },
    { code: 'export default foo || bar;;', ecmaFeatures: { modules: true } },
    { code: 'export default (foo) => foo.bar();;', ecmaFeatures: { arrowFunctions: true, modules: true } },
    { code: 'export default foo = 42;;', ecmaFeatures: { modules: true } },
    { code: 'export default foo += 42;;', ecmaFeatures: { modules: true } }
  ],
  invalid: [

    { code: 'var x = 5;', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'var x =5, y;', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'foo();', errors: [{ message: msg, type: 'ExpressionStatement'}] },
    { code: 'x = foo();', errors: [{ message: msg, type: 'ExpressionStatement'}] },
    { code: 'setTimeout(function() {foo = "bar";; });', errors: [{ message: msg, type: 'ExpressionStatement'}] },
    { code: 'setTimeout(function() {foo = "bar";});;', errors: [{ message: msg, type: 'ExpressionStatement'}] },
    { code: 'if (true) {}\n;[global, extended].forEach(function(){});', errors: [{ message: msg, type: 'ExpressionStatement'}] },
    { code: "throw new Error('foo');", errors: [{ message: msg, type: 'ThrowStatement'}] },

    { code: 'var A = class { a() {} b() {} };', ecmaFeatures: { classes: true }, errors: [{ message: msg, type: 'VariableDeclaration'}] },

    { code: "import theDefault, { named1, named2 } from 'src/mylib';", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ImportDeclaration'}] },

    { code: "export * from 'foo';", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportAllDeclaration'}] },
    { code: "export { foo } from 'foo';", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportNamedDeclaration'}] },
    { code: 'export { foo };', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportNamedDeclaration'}] },
    { code: 'export var foo;', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'export let foo;', ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'export const FOO = 42;', ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'export default foo || bar;', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration'}] },
    { code: 'export default (foo) => foo.bar();', ecmaFeatures: { arrowFunctions: true, modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration'}] },
    { code: 'export default foo = 42;', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration'}] },
    { code: 'export default foo += 42;', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration'}] },

    { code: "import * as utils from './utils'", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ImportDeclaration'}] },
    { code: "import { square, diag } from 'lib'", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ImportDeclaration'}] },
    { code: "import { default as foo } from 'lib'", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ImportDeclaration'}] },
    { code: "import 'src/mylib'", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ImportDeclaration'}] },
    { code: "import theDefault, { named1, named2 } from 'src/mylib'", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ImportDeclaration'}] },
    { code: 'function foo() { return [] }', errors: [{ message: msg, type: 'ReturnStatement'}] },
    { code: 'while(true) { break }', errors: [{ message: msg, type: 'BreakStatement'}] },
    { code: 'while(true) { continue }', errors: [{ message: msg, type: 'ContinueStatement'}] },
    { code: 'let x = 5', ecmaFeatures: { blockBindings: true }, errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'var x = 5', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'var x = 5, y', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'debugger', errors: [{ message: msg, type: 'DebuggerStatement'}] },
    { code: 'foo()', errors: [{ message: msg, type: 'ExpressionStatement'}] },
    { code: 'var x = 5, y', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (var a in b) var i ', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (;;){var i}', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (;;) var i ', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (var j;;) {var i}', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'var foo = {\n bar: baz\n}', errors: [{ message: msg, type: 'VariableDeclaration', line: 3}] },
    { code: 'var foo\nvar bar;;', errors: [{ message: msg, type: 'VariableDeclaration', line: 1}] },
    { code: "throw new Error('foo')", errors: [{ message: msg, type: 'ThrowStatement', line: 1}] },

    { code: 'foo();', errors: [{ message: msg, type: 'ExpressionStatement'}] },
    { code: 'var x = 5, y;', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (var a in b) var i; ', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (;;){var i;}', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (;;) var i; ', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'for (var j;;) {var i;}', errors: [{ message: msg, type: 'VariableDeclaration'}] },
    { code: 'var foo = {\n bar: baz\n};', errors: [{ message: msg, type: 'VariableDeclaration', line: 3}] },
    { code: 'var foo;\nvar bar;;', errors: [{ message: msg, type: 'VariableDeclaration', line: 1}] },
    { code: "throw new Error('foo');", errors: [{ message: msg, type: 'ThrowStatement', line: 1}] },

    // exports, "always"
    { code: "export * from 'foo'", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportAllDeclaration' }] },
    { code: "export { foo } from 'foo'", ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportNamedDeclaration' }] },
    { code: 'export { foo }', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportNamedDeclaration' }] },
    { code: 'export var foo', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'VariableDeclaration' }] },
    { code: 'export let foo', ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: msg, type: 'VariableDeclaration' }] },
    { code: 'export const FOO = 42', ecmaFeatures: { blockBindings: true, modules: true }, errors: [{ message: msg, type: 'VariableDeclaration' }] },
    { code: 'export default foo || bar', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration' }] },
    { code: 'export default (foo) => foo.bar()', ecmaFeatures: { arrowFunctions: true, modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration' }] },
    { code: 'export default foo = 42', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration' }] },
    { code: 'export default foo += 42', ecmaFeatures: { modules: true }, errors: [{ message: msg, type: 'ExportDefaultDeclaration' }] }
  ]
})
