/**
 * @file normalizePath.js
 * @description Cross-platform utility to normalize file paths to use forward slashes.
 */

/**
 * Normalizes a file path to use forward slashes (`/`) regardless of platform.
 *
 * @function normalizePath
 * @memberof MinepackUtils
 * @param {string} filePath - Raw file path (may use backslashes or mixed slashes).
 * @returns {string} Normalized path using forward slashes.
 *
 * @example
 * normalizePath('textures\\blocks\\foo.png') // 'textures/blocks/foo.png'
 * normalizePath('C:\\my-addon\\BP\\manifest.json') // 'C:/my-addon/BP/manifest.json'
 */
export function normalizePath(filePath) {
    return filePath.replace(/\\/g, '/')
}
