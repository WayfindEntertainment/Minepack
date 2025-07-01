// src/utils/index.js

import { parseJSON } from './parseJSON.js'
import { validateUUID } from './validateUUID.js'
import { normalizePath } from './normalizePath.js'
// Add other utility imports here as needed

/**
 * @fileoverview
 * Central utility index for Minepack. This module statically re-exports
 * all utility functions under a single unified object: `MinepackUtils`.
 *
 * This design allows clean imports throughout the CLI codebase:
 * 
 * @example
 * import { MinepackUtils } from '../utils'
 * MinepackUtils.parseJSON('./file.json')
 *
 * Utility modules are grouped here intentionally for discoverability
 * and to avoid repetitive import boilerplate across command modules.
 */

/**
 * @namespace MinepackUtils
 * @description
 * A collection of general-purpose utility functions used throughout
 * the Minepack CLI codebase. All utilities should be pure or side-effect free,
 * unless explicitly documented.
 *
 * Functions are grouped here by import so that they can be accessed cleanly
 * without importing individual files.
 */
export const MinepackUtils = {
    /** @see parseJSON */
    parseJSON,

    /** @see validateUUID */
    validateUUID,

    /** @see normalizePath */
    normalizePath

    // Add additional utilities here
}
