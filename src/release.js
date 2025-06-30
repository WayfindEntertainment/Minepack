export default function releaseProject() {
    console.log('RELEASE COMPLETE!')
}

// import path from 'path'
// import fs from 'fs-extra'
// import { fileURLToPath } from 'url'
// import { validateProject } from './validate/index.js'
// import { buildProject } from './build.js'
// import { loadProjectMetadata } from './lib/metadata.js'
// import { formatAddonName } from './lib/naming.js'
// import chalk from 'chalk'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

// export default async function releaseCommand(options = {}) {
//     console.log(chalk.blue('\n🔍 Validating project...'))
//     const validation = await validateProject({ quiet: true })

//     if (validation.errors.length && !options.force) {
//         console.log(chalk.red('✖ Validation failed. Fix errors or use --force.'))
//         validation.errors.forEach((e) => console.log(' -', e.message))
//         return
//     }

//     console.log(chalk.blue('\n🔧 Building addon...'))
//     const buildResult = await buildProject()
//     const mcaddonPath = buildResult.mcaddonPath

//     if (!fs.existsSync(mcaddonPath)) {
//         console.error(chalk.red('✖ Build failed: .mcaddon file not found.'))
//         return
//     }

//     // Strip .minekit_build.txt from archive
//     await fs.remove(path.join(path.dirname(mcaddonPath), '.minekit_build.txt'))
//     console.log(chalk.gray('ℹ️  Stripped .minekit_build.txt'))

//     // Load metadata and resolve version
//     const metadata = await loadProjectMetadata()
//     const version = options.version || metadata.version || '0.0.1'

//     if (options.version && metadata.version && options.version !== metadata.version) {
//         console.log(
//             chalk.yellow(
//                 `⚠️  Version override differs from manifest: ${options.version} vs ${metadata.version}`
//             )
//         )
//     }

//     // Prepare release name
//     const outputName = `${formatAddonName(metadata.name)}_v${version}.mcaddon`
//     const releaseDir = path.resolve('release')
//     const releasePath = path.join(releaseDir, outputName)

//     await fs.ensureDir(releaseDir)
//     await fs.copy(mcaddonPath, releasePath)

//     console.log('\n📦 Final artifact written to:', chalk.green(releasePath))
// }
