/**
 * @fileoverview Shared JSDoc typedefs for Minepack.
 * @namespace MinepackTypes
 */

/**
 * @typedef {Object} ValidationResult
 * @property {'error' | 'warning' | 'info'} level - Severity of the validation issue
 * @property {string} message - Human-readable explanation of the issue
 * @property {string} rule - Optional rule key that triggered the issue
 * @property {string} [file] - Optional relative file path where the issue occurred
 * @property {string} [suggestion] - Optional suggestion for fixing the issue
 */

/**
 * @typedef {Object} ValidationRule
 * @property {string} key - Unique rule identifier (e.g., 'manifest.description-required')
 * @property {'error' | 'warning' | 'off'} level - Severity level of the rule
 * @property {function(any, string): ValidationResult[]} apply - Rule implementation
 * @property {string} category - Logical group (e.g., 'manifest', 'json', 'naming')
 * @property {string} description - Short explanation of what the rule checks
 */
