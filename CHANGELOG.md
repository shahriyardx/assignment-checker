# Changelog

All notable changes to this project are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-09-07

### Removed
- **Cloud JSON browsing.** The extension no longer talks to `json-hub`. All
  rubrics are loaded from local files.
- **Code evaluation.** The `type: "code"` rubric format and the server-side
  test runner it depended on are gone.
- Unused `notifications` permission and the `web_accessible_resources` entry
  that exposed the icon to every site.
- Dead code: the empty background script, unused `Repo` types, and `test.js`.

### Added
- Load several JSON files at once.
- Tools panel in the top-right of the dashboard, with rubric switching and
  loading built in.
- Rebindable shortcuts with a proper recorder, conflict warning, and reset.
- Toast messages where the extension used to fail silently.

### Changed
- Redesigned the injected panels, the tools panel and the popup as one light
  interface.
- Unchecking a requirement now unchecks its sub-requirements.
- Upgraded to Tailwind 4, TypeScript 7, Biome 2, React 19.2 and Plasmo 0.90.5.

### Fixed
- Missing or corrupt rubrics no longer throw; submissions with no links, no
  submit button and no mark field are all handled.
