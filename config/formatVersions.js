// Permissible format_version values for each major Bedrock content type.
// These values were derived from Mojang documentation, live testing, and community tools.
// Developers can reference this official source for updates:
// https://learn.microsoft.com/minecraft/creator/reference/content/versioning
//
// Note: Minecraft may silently accept newer format_versions in some cases, but this list
// aims to include only well-documented and production-safe values.

export const formatVersionMap = {
    item: [
        '1.16.100', // Introduced Molang features and newer item properties
        '1.20.0' // Compatible with 1.20 content updates
    ],
    block: [
        '1.16.100', // Block geometry updates
        '1.20.0'
    ],
    recipe: [
        '1.12', // Original recipe support
        '1.13.0', // Tagging and feature expansions
        '1.16.100',
        '1.17.0'
    ],
    entity: [
        '1.8.0', // Base entity definition support
        '1.10.0' // Extended animations and AI
    ],
    animation: ['1.8.0', '1.10.0'],
    render_controller: [
        '1.8.0' // Default render controller version
    ]
}
