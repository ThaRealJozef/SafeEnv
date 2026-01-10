# Changelog

All notable changes to SafeEnv are documented here.

## [1.4.0] - 2026-01-10

### Added
- **Pro Backend**: Live API via Vercel + Supabase
- **Cloud Pattern Sync**: Download latest detection patterns from SafeEnv Cloud
- **License Validation**: Real API key verification
- **Premium Sidebar UI**: Complete redesign with custom logo
- **Guided Pattern Wizard**: No regex knowledge needed
- **Styled Tooltips**: Helpful hover explanations
- **Paste Button**: Native clipboard paste for license keys

### Changed
- Button text: "Sync Latest Patterns" for clarity
- Rate limiting: 5 syncs per hour

### Security
- RLS enabled on all Supabase tables
- Service role key used server-side only
- Input validation on all API endpoints

---

## [1.3.0] - 2026-01-05

### Fixed
- Removed entropy detection (caused false positives)
- Removed "Password in URL" pattern (too broad)
- Rebuilt WASM with prefix-only patterns

---

## [1.2.0] - 2026-01-03

### Added
- **Rust/WASM Scanner Engine**: 10x faster than JavaScript
- **50+ Prefix-Based Patterns**: High precision detection
- Custom pattern support (1 free, unlimited Pro)
- AllowList for whitelisting known safe values
- Ghost alert decorations

---

## [1.1.0] - 2025-12-28

### Added
- Chrome Extension: Async block-first engine
- Scanning UI for browser extension

---

## [1.0.1] - 2025-12-20

### Added
- Glassmorphism UI
- Production logging

---

## [1.0.0] - 2025-12-15

### Added
- Initial release
- VS Code Extension
- Chrome Extension
- Basic secret pattern detection
