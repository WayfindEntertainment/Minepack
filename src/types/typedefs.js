/**
 * @fileoverview Shared JSDoc typedefs for Minepack.
 * @namespace MinepackTypes
 */

/**
 * @typedef {Object} ValidationRule
 * @property {string} key - Unique rule identifier (e.g., 'manifest.description-required')
 * @property {ValidationLevel} level - Severity level of the rule
 * @property {function(any, string): ValidationResult[]} apply - Rule implementation
 * @property {string} category - Logical group (e.g., 'manifest', 'json', 'naming')
 * @property {string} description - Short explanation of what the rule checks
 */

/**
 * @typedef {Object} ValidationResult
 * A single instance of a rule finding something problematic.
 *
 * Note: The `rule` and `level` are tracked in the rule registry,
 * not repeated in each result for clarity and DRYness.
 *
 * @property {string} file - Absolute path to the file that triggered the result
 * @property {string} message - Human-readable message describing the problem
 */

/**
 * @typedef {Object} RuleContext
 * @property {string} bpRoot - Absolute or relative path to the behavior pack root
 * @property {string} rpRoot - Absolute or relative path to the resource pack root
 */

/**
 * @readonly
 * @enum {'error' | 'warning' | 'info'}
 */
export const ValidationLevel = {
    ERROR: 2,
    WARNING: 1,
    INFO: 0
}
