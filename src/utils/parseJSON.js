import fs from 'fs'

/**
 * Reads and safely parses a JSON file
 * @param {string} filePath
 * @returns {{ success: true, data: any } | { success: false, error: Error }}
 */
export function parseJSON(filePath) {
    try {
        const raw = fs.readFileSync(filePath, 'utf8')
        return { success: true, data: JSON.parse(raw) }
    } catch (error) {
        return { success: false, error }
    }
}
