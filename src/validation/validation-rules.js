// ./bin/validation/validation-rules.js

import * as manifest from './rules/manifest.js'
import * as json from './rules/json.js'
import * as id from './rules/id.js'
import * as texture from './rules/texture.js'
import * as fs from './rules/fs.js'
import * as script from './rules/script.js'

/**
 * @typedef {Object} ValidationRule
 * @property {'error'|'warning'} level - The severity of the rule violation
 * @property {string} description - A human-readable explanation of what this rule enforces
 * @property {(context: ValidationContext) => ValidationResult[]} apply - Rule logic function
 */

/**
 * A unique string key that identifies each validation rule.
 * Convention: '<category>/<rule-name>'
 * 
 * Examples:
 * - 'json/has-format-version'
 * - 'manifest/has-description'
 * - 'id/namespace-whitelist'
 * 
 * @typedef {string} ValidationKey
 */

/**
 * The full registry of all available validation rules keyed by unique rule ID.
 * This is used to configure, run, and document the behavior of each rule.
 * 
 * @type {Record<ValidationKey, ValidationRule>}
 */
export const VALIDATION_RULES = {
    'manifest/has-modules': {
        level: 'error',
        description: 'The "modules" array must be present in manifest.json',
        apply: manifest.validateHasModules
    },

    'manifest/has-description': {
        level: 'error',
        description: 'The manifest "description" field must be present and non-empty',
        apply: manifest.validateHasDescription
    },

    'manifest/dependencies-exist': {
        level: 'warning',
        description: 'All dependencies listed in the manifest should exist and be valid UUIDs',
        apply: manifest.validateDependenciesExist
    },

    'json/has-format-version': {
        level: 'error',
        description: 'All JSON files must contain a valid "format_version" field',
        apply: json.validateHasFormatVersion
    },

    'json/valid-format-version': {
        level: 'warning',
        description: 'The "format_version" should match a known safe version for this file type',
        apply: json.validateFormatVersionKnown
    },

    'json/valid-top-level-key': {
        level: 'error',
        description: 'A valid top-level key (e.g., "minecraft:item") must be present in JSON files',
        apply: json.validateTopLevelKey
    },

    'json/not-empty-or-corrupt': {
        level: 'error',
        description: 'Empty or invalid JSON files are not allowed',
        apply: json.validateNotEmptyOrCorrupt
    },

    'id/valid-names': {
        level: 'error',
        description: 'Identifiers must follow "namespace:name" format and be lowercase',
        apply: id.validateIdentifierFormat
    },

    'id/no-duplicate-filenames': {
        level: 'error',
        description: 'Filenames in the same folder must be unique (case-insensitive)',
        apply: id.validateNoDuplicateFilenames
    },

    'id/namespace-whitelist': {
        level: 'warning',
        description: 'Identifiers should use the correct namespace unless explicitly whitelisted',
        apply: id.validateNamespaceWhitelist
    },

    'texture/exists': {
        level: 'warning',
        description: 'Texture files referenced should exist (warn if missing)',
        apply: texture.validateTextureReferences
    },

    'fs/no-junk-root-files': {
        level: 'warning',
        description: 'Unnecessary system files (e.g. .DS_Store, Thumbs.db) should not be in pack roots',
        apply: fs.validateNoJunkFiles
    },

    'fs/unexpected-top-level-files': {
        level: 'warning',
        description: 'Unexpected files/folders at the top level of RP/BP should be reviewed',
        apply: fs.validateUnexpectedTopLevelFiles
    },

    'script/entry-not-empty': {
        level: 'warning',
        description: 'Script entry file (main.js) should not be empty or comments only',
        apply: script.validateScriptNotEmpty
    }
}
