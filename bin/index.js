#!/usr/bin/env node
/* eslint-disable import/extensions */
/* eslint-disable no-console */
// minepack-cli/index.js

import { Command } from 'commander'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
// import { loadTemplate, applyTemplate } from './template-loader.js'
// import { templates } from './template-registry.js'

const program = new Command()

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'))

program
    .name('minepack')
    .description('Toolkit for Minecraft Bedrock addon development')
    .version(pkg.version)

program
    .command('help')
    .description('Show detailed usage instructions')
    .action(() => {
        console.log(`
Minepack - Minecraft Bedrock Addon Scaffolder

This tool helps you generate behavior and resource pack folders,
manifest files, starter scripts, and optional content templates.

Usage:
  npx minepack                      Launch guided setup
  npx minepack --template=custom-item  Scaffold an addon with a starter item
  npx minepack --list-templates     View all available templates
  npx minepack --yes                Skip prompts (use defaults)

Templates:
  Use --template=<name> to scaffold common addon patterns.
  Run --list-templates to see what’s available.

Learn more:
  https://wayfindminecraft.com/wfir/minepack
`)
        process.exit(0)
    })

program
    .command('new')
    .description('Scaffold a new addon project')
    .option('--no-readme', 'Skip README file generation')
    .option('--no-gitignore', 'Skip generating a .gitignore file')
    .option('--no-icon', 'Skip generating pack_icon.png files')
    .option('--yes, -y', 'Skip prompts and use defaults')
    .option('--silent', 'Suppress output')
    .option('--debug', 'Show detailed debug logs')
    .option('--rp-only', 'Include only resource pack')
    .option('--bp-only', 'Include only behavior pack')
    // .option('--version <ver>', 'Target Minecraft version (e.g. 1.20.81)')
    // .option('--preview', 'Use the latest preview version settings')
    // .option('--min-engine <ver>', 'Override min_engine_version manually')
    // .option('--experimental', 'Enable experimental manifest features')
    // .option('--template <name>', 'Starter template to use', 'barebones')
    // .option('--list-templates', 'List available templates')
    .action((args) => import('../src/new.js').then((m) => m.default(args)))

program
    .command('build')
    .description('Build a .mcaddon or .mcpack from your project')
    .option('--output <path>', 'Custom output file name')
    .option('--rp-only', 'Include only resource pack')
    .option('--bp-only', 'Include only behavior pack')
    .option('--zip', 'Create .zip file instead of .mcaddon')
    .option('--no-clean', 'Don’t wipe /dist before building')
    .option('--force', 'Build even if validation reports errors')
    .option('--silent', 'Suppress output')
    .option('--debug', 'Show detailed debug logs')
    .action(() => import('../src/build.js').then((m) => m.default()))

program
    .command('validate')
    .description('Validate addon files for errors and warnings')
    .option('--silent', 'Suppress output')
    .option('--debug', 'Show detailed debug logs')
    .action(() => import('../src/validate.js').then((m) => m.default()))

program
    .command('dev')
    .description('Copy BP/RP to Minecraft development folders for testing')
    .option('--name <project>', 'Override project folder name in dev packs')
    .option('--silent', 'Suppress output')
    .option('--debug', 'Show detailed debug logs')
    .action(() => import('../src/dev.js').then((m) => m.default()))

program
    .command('watch')
    .description('Watches a target folder for changes and then reloads the dev environment')
    .action(() => import('../src/dev.js').then((m) => m.default()))

// Default: show help if no subcommand
if (!process.argv.slice(2).length) {
    program.outputHelp()
} else {
    program.parse()
}
// program
//     .hook('preAction', () => {
//         if (program.opts().listTemplates) {
//             console.log('\nAvailable templates:\n')
//             // eslint-disable-next-line no-restricted-syntax
//             for (const [name, desc] of Object.entries(templates)) {
//                 console.log(`  ${name.padEnd(14)} - ${desc}`)
//             }
//             console.log('\nUse with: npx minepack --template=<name>\n')
//             process.exit(0)
//         }
//     })
//     .parse()

// const writeAddon = (answers) => {
//     const basePath = path.resolve(process.cwd(), answers.addonName.replace(/\s+/g, '_'))
//     if (!existsSync(basePath)) mkdirSync(basePath)

//     const bpEnabled = !options.noBp && !options.rpOnly
//     const rpEnabled = !options.noRp && !options.bpOnly
//     let rpUUID = null

//     if (rpEnabled) {
//         const rpPath = path.join(basePath, 'RP')
//         mkdirSync(rpPath)
//         rpUUID = uuidv4()
//         const manifest = {
//             format_version: 2,
//             header: {
//                 name: `${answers.addonName} RP`,
//                 description: answers.description,
//                 uuid: rpUUID,
//                 version: [1, 0, 0],
//                 min_engine_version: (options.minEngine || options.version || '1.20.81')
//                     .split('.')
//                     .map(Number)
//             },
//             modules: [
//                 {
//                     type: 'resources',
//                     uuid: uuidv4(),
//                     version: [1, 0, 0]
//                 }
//             ],
//             metadata: {
//                 authors: [answers.creatorName],
//                 generated_with: 'minepack'
//             }
//         }
//         writeFileSync(path.join(rpPath, 'manifest.json'), JSON.stringify(manifest, null, 2))
//         createPackIcon(path.join(rpPath, 'pack_icon.png'), answers.addonName)
//     }

//     if (bpEnabled) {
//         const bpPath = path.join(basePath, 'BP')
//         mkdirSync(bpPath)
//         const dependencies = rpUUID ? [{ uuid: rpUUID, version: [1, 0, 0] }] : []
//         const manifest = createManifest({
//             name: `${answers.addonName} BP`,
//             description: answers.description,
//             version: options.minEngine || options.version || '1.20.81',
//             type: 'script',
//             dependencies,
//             authors: [answers.creatorName]
//         })
//         writeFileSync(path.join(bpPath, 'manifest.json'), JSON.stringify(manifest, null, 2))

//         const scriptsPath = path.join(bpPath, 'scripts')
//         mkdirSync(scriptsPath)
//         writeFileSync(path.join(scriptsPath, 'main.js'), '// Entry point for behavior scripts\n')
//         createPackIcon(path.join(bpPath, 'pack_icon.png'), answers.addonName)
//     }

//     if (!options.noReadme) {
//         const readme = `# ${answers.addonName}\n\n${answers.description}\n\nCreated by ${answers.creatorName} using minepack.`
//         writeFileSync(path.join(basePath, 'README.md'), readme)
//     }

//     if (!options.noGitignore) {
//         const gitignore = `node_modules/\n.DS_Store\n.vscode/\n*.mcaddon\nBP/scripts/*.js.map\n`
//         writeFileSync(path.join(basePath, '.gitignore'), gitignore)
//     }

//     const config = {
//         name: answers.addonName,
//         namespace: answers.namespace,
//         template: options.template,
//         version: options.version || '1.20.81'
//     }
//     writeFileSync(path.join(basePath, 'minepack.json'), JSON.stringify(config, null, 2))

//     if (!options.silent) {
//         console.log(`✅ Addon scaffold created at: ${basePath}\n`)
//         console.log(`Next steps:`)
//         if (bpEnabled) console.log(`  - Add scripts to BP/scripts/`)
//         if (rpEnabled) console.log(`  - Add textures, models, or sounds to RP/`)
//         console.log(`  - Test your addon in Minecraft or Minecraft Preview`)
//     }
// }

// const run = async () => {
//     const answers = await promptUser()
//     writeAddon(answers)
// }

// run()
