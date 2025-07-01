/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid'
import inquirer from 'inquirer'
import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import chalk from 'chalk'

/**
 * A module level object that represents the options passed to the default function.
 */
let options = {
    readme: false,
    gitignore: false,
    icon: false,
    yes: false,
    silent: false,
    debug: false,
    bpOnly: false,
    rpOnly: false
}

function createManifest(name, description, version = '1.20.81', type = 'data', dependencies = []) {
    return {
        format_version: 2,
        header: {
            name,
            description,
            uuid: uuidv4(),
            version: [1, 0, 0],
            min_engine_version: version.split('.').map(Number)
        },
        modules: [
            {
                type,
                uuid: uuidv4(),
                version: [1, 0, 0],
                entry: type === 'script' ? 'scripts/main.js' : undefined
            }
        ],
        dependencies
    }
}

const isValidVersion = (ver) => /^\d+\.\d+\.\d+$/.test(ver)

const promptUser = async () => {
    if (options.version && !isValidVersion(options.version)) {
        console.error('Invalid --version format. Use semver format like 1.20.81')
        process.exit(1)
    }
    if (options.minEngine && !isValidVersion(options.minEngine)) {
        console.error('Invalid --min-engine format. Use semver format like 1.20.81')
        process.exit(1)
    }

    if (options.yes) {
        return {
            addonName: 'My Addon',
            creatorName: 'Anonymous',
            description: 'Created with minepack',
            namespace: 'addon'
        }
    }

    return inquirer.prompt([
        {
            type: 'input',
            name: 'addonName',
            message: 'What is the name of your addon?'
        },
        {
            type: 'input',
            name: 'creatorName',
            message: 'Who is the creator?'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Short description of the addon:'
        },
        {
            type: 'input',
            name: 'namespace',
            message: 'Preferred namespace prefix (e.g., wfir):',
            validate: (input) => /^[a-z0-9_]+$/.test(input) || 'Must be lowercase with no spaces'
        }
    ])
}

const createPackIcon = (filePath, addonName) => {
    const canvas = createCanvas(256, 256)
    const ctx = canvas.getContext('2d')

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 256, 256)
    gradient.addColorStop(0, '#4facfe') // light blue
    gradient.addColorStop(0.5, '#00f2fe') // cyan
    gradient.addColorStop(1, '#43e97b') // green
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)

    // Add addon name (or abbreviation)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const text = addonName.length > 12 ? `${addonName.slice(0, 10)}…` : addonName
    ctx.fillText(text, 128, 128)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(filePath, buffer)
}

export default function createNewAddon(args) {
    // Set the values for the module level `options` object based on user CLI argument inputs
    options = {
        readme: args?.readme || false,
        gitignore: args?.gitignore || false,
        icon: args?.icon || false,
        yes: args?.yes || false,
        silent: args?.silent || false,
        debug: args?.debug || false,
        rpOnly: args?.rpOnly || false,
        bpOnly: args?.bpOnly || false
    }

    if (options.bpOnly && options.rpOnly) {
        console.error(chalk.red('✖ The flags )--bp-only and --rp-only are mutually exclusive.'))
        process.exit(1)
    }
    console.log('NEW ADDON BUILD COMPLETE!')
    console.log(args)
    console.log(options)

    promptUser().then((answers) => {
        console.log(answers)

        const basePath = path.resolve(process.cwd(), answers.addonName.replace(/\s+/g, '_'))
        if (!existsSync(basePath)) mkdirSync(basePath)

        const bpEnabled = !options.noBp && !options.rpOnly
        const rpEnabled = !options.noRp && !options.bpOnly
        let rpUUID = null

        if (rpEnabled) {
            const rpPath = path.join(basePath, 'RP')
            mkdirSync(rpPath)
            rpUUID = uuidv4()
            const manifest = {
                format_version: 2,
                header: {
                    name: `${answers.addonName} RP`,
                    description: answers.description,
                    uuid: rpUUID,
                    version: [1, 0, 0],
                    min_engine_version: (options.minEngine || options.version || '1.20.81')
                        .split('.')
                        .map(Number)
                },
                modules: [
                    {
                        type: 'resources',
                        uuid: uuidv4(),
                        version: [1, 0, 0]
                    }
                ],
                metadata: {
                    authors: [answers.creatorName],
                    generated_with: 'minepack'
                }
            }
            writeFileSync(path.join(rpPath, 'manifest.json'), JSON.stringify(manifest, null, 2))
            createPackIcon(path.join(rpPath, 'pack_icon.png'), answers.addonName)
        }

        if (bpEnabled) {
            const bpPath = path.join(basePath, 'BP')
            mkdirSync(bpPath)
            const dependencies = rpUUID ? [{ uuid: rpUUID, version: [1, 0, 0] }] : []
            const manifest = createManifest({
                name: `${answers.addonName} BP`,
                description: answers.description,
                version: options.minEngine || options.version || '1.20.81',
                type: 'script',
                dependencies,
                authors: [answers.creatorName]
            })
            writeFileSync(path.join(bpPath, 'manifest.json'), JSON.stringify(manifest, null, 2))

            const scriptsPath = path.join(bpPath, 'scripts')
            mkdirSync(scriptsPath)
            writeFileSync(
                path.join(scriptsPath, 'main.js'),
                '// Entry point for behavior scripts\n'
            )
            createPackIcon(path.join(bpPath, 'pack_icon.png'), answers.addonName)
        }

        if (!options.noReadme) {
            const readme = `# ${answers.addonName}\n\n${answers.description}\n\nCreated by ${answers.creatorName} using minepack.`
            writeFileSync(path.join(basePath, 'README.md'), readme)
        }

        if (!options.noGitignore) {
            const gitignore = `node_modules/\n.DS_Store\n.vscode/\n*.mcaddon\nBP/scripts/*.js.map\n`
            writeFileSync(path.join(basePath, '.gitignore'), gitignore)
        }

        const config = {
            name: answers.addonName,
            namespace: answers.namespace,
            template: options.template,
            version: options.version || '1.20.81'
        }
        writeFileSync(path.join(basePath, 'minepack.json'), JSON.stringify(config, null, 2))

        if (!options.silent) {
            console.log(`✅ Addon scaffold created at: ${basePath}\n`)
            console.log(`Next steps:`)
            if (bpEnabled) console.log(`  - Add scripts to BP/scripts/`)
            if (rpEnabled) console.log(`  - Add textures, models, or sounds to RP/`)
            console.log(`  - Test your addon in Minecraft or Minecraft Preview`)
        }
    })
}
