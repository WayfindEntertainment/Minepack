# Minepack

**Minepack** is a CLI toolkit for Minecraft Bedrock addon developers — validate, scaffold, build,
and release packs with confidence.

**NOTE**: THIS PACKAGE IS STILL UNDER DEVELOPMENT!

## Why Minepack?

Modern Minecraft Bedrock addon development lacks structured tooling. Many developers rely on manual
folder setups, inconsistent validation methods, and custom build scripts. **Minepack** fills this
gap with a clean, extensible, and scriptable CLI focused on real-world Bedrock workflows.

## Key Features

- 🔨 **`minepack new`** — Scaffold a new addon with sensible defaults
- 🧪 **`minepack validate`** — Catch errors, warnings, and structural issues
- 📦 **`minepack build`** — Prepare a distributable `.mcaddon` and output folder
- 🚀 **`minepack release`** — Bundle and sign a ZIP release for distribution
- 🖥️ **`minepack dev`** — Sync files to Minecraft’s development folders (Windows only)
- 👀 **`minepack watch`** — Monitor for changes and sync live to Minecraft dev folders
- ⚙️ **Extensive config** — Customize behavior with `.minepackrc` or `minepack.config.js`

## Quick Start

```bash
npx minepack new my-addon
cd my-addon
npx minepack validate
npx minepack build
```

## Documentation

- [Installation](docs/install.md)
- [Configuration](docs/config.md)
- [Commands](docs/commands.md)
- [Templates](docs/templates.md)
- [Validation Rules](docs/validation.md)
- [Troubleshooting](docs/troubleshooting.md)
- [FAQ](docs/faq.md)
- [Integrity & Trust](docs/integrity.md)

## Philosophy

Minepack is designed to be:

- **Predictable** – What it does is obvious and visible
- **Minimal** – No GUIs, no magic, no bloat
- **Extensible** – Built with scripting and automation in mind
- **Accurate** – Validation and builds mirror Minecraft's actual behavior

It does not try to replace IDEs or offer a graphical experience. It complements your existing
workflow — especially when using version control, CI, or automated release pipelines.

## License

MIT — Copyright (c) Wayfind Entertainment LLC
