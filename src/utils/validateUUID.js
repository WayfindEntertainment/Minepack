/**
 * @file validateUUID.js
 * @description Utility function to validate UUID format
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Checks if a string is a valid UUID v1–v5.
 *
 * @function validateUUID
 * @memberof MinepackUtils
 * @param {string} uuid - The UUID string to validate.
 * @returns {boolean} True if the string is a valid UUID, false otherwise.
 *
 * @example
 * validateUUID('123e4567-e89b-12d3-a456-426614174000') // true
 * validateUUID('not-a-uuid') // false
 *
 * @see {@link https://www.ietf.org/rfc/rfc4122.txt|RFC 4122 UUID Specification}
 */
export function validateUUID(uuid) {
    return UUID_REGEX.test(uuid)
}
