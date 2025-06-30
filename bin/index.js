#!/usr/bin/env node
/* eslint-disable import/extensions */
/* eslint-disable no-console */

import { Command } from 'commander'
// import inquirer from 'inquirer'
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
// import { v4 as uuidv4 } from 'uuid'
import path from 'path'
// import { createCanvas } from 'canvas'
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
    // .option('--version <ver>', 'Target Minecraft version (e.g. 1.20.81)')
    // .option('--preview', 'Use the latest preview version settings')
    // .option('--min-engine <ver>', 'Override min_engine_version manually')
    // .option('--experimental', 'Enable experimental manifest features')
    // .option('--template <name>', 'Starter template to use', 'barebones')
    // .option('--list-templates', 'List available templates')
    .action(() => import('../src/new.js').then((m) => m.default()))

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
