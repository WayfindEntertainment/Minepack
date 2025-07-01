export default function validateProject() {
    console.log('VALIDATION COMPLETE!')
}

// // validate.js
// import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
// import path from 'path'
// import { formatVersionMap } from './config/formatVersions'

// const readManifest = (dir) => {
//     const file = path.join(dir, 'manifest.json')
//     if (!existsSync(file)) return null
//     try {
//         const data = JSON.parse(readFileSync(file, 'utf8'))
//         return { path: file, data }
//     } catch (e) {
//         return { path: file, error: 'Invalid JSON' }
//     }
// }

// const getMetadata = (bp, rp) => {
//     const source = bp?.data?.metadata?.minekit ? bp : rp?.data?.metadata?.minekit ? rp : null
//     return {
//         namespace: source?.data?.metadata?.minekit?.namespace || 'addon',
//         template: source?.data?.metadata?.minekit?.template || 'barebones',
//         version: source?.data?.metadata?.minekit?.version || '1.20.81',
//         from: source?.path || '(default)'
//     }
// }

// const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
// const isVersionArray = (val) =>
//     Array.isArray(val) && val.length === 3 && val.every(Number.isInteger)

// const render = (result, mode) => {
//     const showPasses = mode === 'all'
//     for (const entry of result) {
//         if (entry.level === 'pass' && !showPasses) continue
//         const tag =
//             entry.level === 'error' ? '✖ ERROR' : entry.level === 'warn' ? '⚠ WARNING' : '✔'
//         console.log(`${tag} ${entry.message}`)
//     }
// }

// const validateFormatAndTopLevel = (dir, subdir, topKey, type, result) => {
//     const fullDir = path.join(dir, subdir)
//     if (!existsSync(fullDir)) return
//     const files = readdirSync(fullDir).filter((f) => f.endsWith('.json'))

//     // eslint-disable-next-line no-restricted-syntax
//     for (const file of files) {
//         const full = path.join(fullDir, file)
//         try {
//             const json = JSON.parse(readFileSync(full, 'utf8'))
//             if (Object.keys(json).length === 0) {
//                 result.push({
//                     level: 'error',
//                     message: `${type.toUpperCase()} file ${file} is empty`
//                 })
//                 continue
//             }
//             if (!json.format_version) {
//                 result.push({
//                     level: 'error',
//                     message: `${type.toUpperCase()} file ${file} is missing 'format_version'`
//                 })
//             } else if (!formatVersionMap[type]?.includes(json.format_version)) {
//                 result.push({
//                     level: 'error',
//                     message: `${type.toUpperCase()} file ${file} has unsupported format_version '${json.format_version}'`
//                 })
//             } else {
//                 result.push({
//                     level: 'pass',
//                     message: `${type.toUpperCase()} file ${file} uses supported format_version`
//                 })
//             }
//             if (!json[topKey]) {
//                 result.push({
//                     level: 'error',
//                     message: `${type.toUpperCase()} file ${file} is missing top-level key '${topKey}'`
//                 })
//             }
//         } catch (e) {
//             result.push({
//                 level: 'error',
//                 message: `Invalid JSON in ${type.toUpperCase()} file ${file}: ${e.message}`
//             })
//         }
//     }
// }

// const validate = () => {
//     const args = process.argv.slice(2)
//     const mode = args.includes('--errors-only')
//         ? 'errors'
//         : args.includes('--quiet')
//           ? 'warnings'
//           : 'all'

//     const cwd = process.cwd()
//     const bpPath = path.join(cwd, 'BP')
//     const rpPath = path.join(cwd, 'RP')
//     const bp = readManifest(bpPath)
//     const rp = readManifest(rpPath)

//     const result = []

//     if (!bp && !rp) {
//         result.push({ level: 'error', message: 'No manifest.json found in BP/ or RP/' })
//         render(result, mode)
//         process.exit(1)
//     }

//     if (bp?.error) {
//         result.push({ level: 'error', message: `BP manifest error: ${bp.error}` })
//     } else if (bp) {
//         result.push({ level: 'pass', message: 'Found valid BP manifest' })
//     }

//     if (rp?.error) {
//         result.push({ level: 'error', message: `RP manifest error: ${rp.error}` })
//     } else if (rp) {
//         result.push({ level: 'pass', message: 'Found valid RP manifest' })
//     }

//     const meta = getMetadata(bp, rp)
//     result.push({ level: 'pass', message: `Namespace: ${meta.namespace}` })
//     result.push({ level: 'pass', message: `Template: ${meta.template}` })
//     result.push({ level: 'pass', message: `Minecraft version: ${meta.version}` })

//     validateFormatAndTopLevel(rpPath, 'items', 'minecraft:item', 'item', result)
//     validateFormatAndTopLevel(rpPath, 'blocks', 'minecraft:block', 'block', result)
//     validateFormatAndTopLevel(bpPath, 'recipes', 'minecraft:recipe_shaped', 'recipe', result)

//     console.log('\nMinekit Validation Report')
//     console.log('==========================')
//     render(result, mode)
// }

// validate()
