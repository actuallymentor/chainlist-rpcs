# Changelog

## [1.0.0] - 2026-10-01

### Fixed
- Use explicit extensions for native Node and browser ESM imports.
- Export TypeScript declarations for modern module resolution.
- Preserve the upstream license in the published package.
- Correct helper usage in README examples.

### Changed
- Limit npm contents to runtime files, declarations, and documentation.
- Test packed-package imports, TypeScript resolution, and browser bundling.

### Breaking
- Require Node.js 22+ and expose only the root API and package metadata.
