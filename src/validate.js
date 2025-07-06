import path from 'path'
import fs from 'fs'
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

    if (!bpRoot && !rpRoot) {
        console.error('❌ At least one of --bp or --rp must be provided and valid.')
        process.exit(1)
    }

    if (options.silent && options.verbose) {
        console.error('❌ Options --silent and --verbose cannot be used together.')
        process.exit(1)
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
            console.log(`\n❌ ${errors.length} error${errors.length !== 1 ? 's' : ''} found:`)
            errors.forEach((e) => {
                console.log(`  [${e.rule}] ${e.message} ('${e.file}')`)
            })
        }

        if (warnings.length > 0) {
            console.log(`\n⚠️ ${warnings.length} warning${warnings.length !== 1 ? 's' : ''} found:`)
            warnings.forEach((w) => {
                console.log(`  [${w.rule}] ${w.message} ('${w.file}')`)
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
        process.exit(1)
    }

    if (warnings.length > 0 && failOnWarning) {
        process.exit(1)
    }

    process.exit(0)
}
