import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

import { VALIDATION_RULES } from './validation/validation-rules.js'
import { ValidationLevel } from './validation/constants.js'
import { normalizePath } from './utils/validatePath.js'

function sanitizeDir(inputPath) {
    const resolved = path.resolve(inputPath)
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
        return null
    }
    return normalizePath(resolved)
}

/**
 * A simplified representation of a validation result paired with its source rule.
 * @typedef {Object} RuleMessage
 * @property {string} rule - The rule key that generated this message
 * @property {string} file - Absolute file path that triggered the rule
 * @property {string} message - Human-readable description of the issue
 */

/**
 * Resolves the final path for a validation report based on user input.
 *
 * Supports either:
 * - a direct path to a `.json` file (e.g., `./report.json`)
 * - a directory path (e.g., `./output/`) in which `report.json` will be placed
 *
 * If the path does not exist:
 * - If it ends in `.json`, it will attempt to create the parent directory
 * - If it does not include an extension, it's assumed to be a directory, and
 *   `report.json` will be placed inside it
 *
 * Throws if the path ends in an unsupported extension (e.g., `.txt`)
 *
 * @param {string} userInput - The raw path provided by the user
 * @returns {string} - Absolute path to the output report.json file
 * @modifies Filesystem
 */
function resolveReportPath(userInput) {
    const resolved = path.resolve(userInput)
    const ext = path.extname(resolved)

    if (fs.existsSync(resolved)) {
        const stats = fs.statSync(resolved)

        if (stats.isDirectory()) {
            // If it's an existing directory, place report.json inside it
            return path.join(resolved, 'report.json')
        }

        if (ext === '.json') {
            // Valid existing JSON file path
            return resolved
        }

        // Invalid file extension on existing file
        throw new Error(`Invalid --report extension: must be .json (got "${ext}")`)
    }

    // Path does not exist yet
    if (!ext) {
        // No extension — assume it's a directory path
        fs.mkdirSync(resolved, { recursive: true })
        return path.join(resolved, 'report.json')
    }

    if (ext !== '.json') {
        // Explicitly provided file with unsupported extension
        throw new Error(`Invalid --report extension: must be .json (got ".${ext}")`)
    }

    // Valid .json file path that doesn't exist yet — ensure parent folder exists
    fs.mkdirSync(path.dirname(resolved), { recursive: true })
    return resolved
}

/**
 * Main entry point for the `validate` subcommand.
 * @param {Object} options Note that although the `bp` and `rp` inputs are both
 * optional, at least one MUST be provided or the function will not validate.
 * @param {string} [options.bp] - Behavior pack folder path (relative or absolute)
 * @param {string} [options.rp] - Resource pack folder path (relative or absolute)
 * @param {boolean} [options.silent] - Suppress console output
 * @param {boolean} [options.verbose] - Show info-level messages
 * @param {boolean} [options.warningsAsErrors] - Treat warnings as errors
 * @param {boolean} [options.errorsAsWarnings] - Downgrade errors to warnings
 * @param {string} [options.report] - Optional path to write report.json
 */
export default async function validate(options = {}) {
    const bpRoot = await sanitizeDir(options.bp)
    const rpRoot = await sanitizeDir(options.rp)
    let reportPath

    if (!bpRoot && !rpRoot) {
        console.error('❌ At least one of --bp or --rp must be provided and valid.')
        process.exit(1)
    }

    if (options.silent && options.verbose) {
        console.error('❌ Options --silent and --verbose cannot be used together.')
        process.exit(1)
    }

    if (options.report) {
        try {
            reportPath = resolveReportPath(options.report)
        } catch (err) {
            console.error(chalk.red(`Error: ${err.message}`))
            process.exit(1)
        }
    }

    /** @type {RuleMessage[]} */
    const errors = []
    /** @type {RuleMessage[]} */
    const warnings = []
    /** @type {RuleMessage[]} */
    const info = []

    /** @type {{ bp?: string, rp?: string }} */
    const context = {}
    if (bpRoot) context.bp = bpRoot
    if (rpRoot) context.rp = rpRoot

    Object.entries(VALIDATION_RULES).forEach(([key, rule]) => {
        const results = rule.apply(context)
        results.forEach((res) => {
            const entry = {
                rule: key,
                file: res.file,
                message: res.message
            }

            if (rule.level === ValidationLevel.ERROR) {
                errors.push(entry)
            } else if (rule.level === ValidationLevel.WARNING) {
                warnings.push(entry)
            } else {
                info.push(entry)
            }
        })
    })

    if (!options.silent) {
        if (errors.length > 0) {
            console.log(chalk.red(`\n❌ ${errors.length} error${errors.length !== 1 ? 's' : ''} found:`))
            errors.forEach((e) => {
                console.log(chalk.red(`  [${e.rule}] ${e.message} ('${e.file}')`))
            })
        }

        if (warnings.length > 0) {
            console.log(chalk.red(`\n⚠️ ${warnings.length} warning${warnings.length !== 1 ? 's' : ''} found:`))
            warnings.forEach((w) => {
                console.log(chalk.yellow(`  [${w.rule}] ${w.message} ('${w.file}')`))
            })
        }

        if (options.verbose && info.length > 0) {
            console.log(`\nℹ️ ${info.length} info message${info.length !== 1 ? 's' : ''}:`)
            info.forEach((i) => {
                console.log(`  [${i.rule}] ${i.message} ('${i.file}')`)
            })
        }

        if (errors.length === 0 && warnings.length === 0) {
            console.log('✅ No issues found.')
        }
    }

    if (reportPath) {
        const report = {
            errors,
            warnings,
            info,
            timestamp: new Date().toISOString()
        }
        await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 4), 'utf8')
    }

    if (errors.length > 0 && !ignoreErrors) {
        console.log(chalk.red(`Validation failed due to ${errors.length} error${errors.length !== 1 ? 's' : ''}.`))
        process.exit(1)
    }

    if (warnings.length > 0 && failOnWarning) {
        console.log(chalk.yellow(`Validation failed due to ${warnings.length} warning${warnings.length !== 1 ? 's' : ''}.`))
        process.exit(1)
    }

    process.exit(0)
}
