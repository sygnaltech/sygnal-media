# Third-party notices

The [MIT License](LICENSE) applies to Michael Wells's original code and documentation. Dependencies and third-party assets remain subject to their respective copyright and license terms. Inclusion or reference here does not grant additional rights to them.

This review uses the versions in `package-lock.json` and license files in the matching installed direct packages. The [generated inventory](DEPENDENCY_LICENSES.md) records all locked package locations and their declared license expressions. Regenerate it with `npm run licenses` after changing the lockfile. Metadata can omit licenses or notices for code bundled inside packages; inspect the upstream distributions when preparing a release.

## Direct dependencies

Paths below identify license files inside the relevant installed package directory under `node_modules/`. Preserve the full texts and any additional notices when redistributing the relevant packages or code bundled from them.

| Package | Locked version | License | License evidence |
| --- | --- | --- | --- |
| `@rive-app/canvas` | 2.31.6 | MIT | Package and lockfile metadata; [Rive runtime license](https://github.com/rive-app/rive-js/blob/master/LICENSE) |
| `@rive-app/webgl2` | 2.31.6 | MIT | Package and lockfile metadata; [Rive runtime license](https://github.com/rive-app/rive-js/blob/master/LICENSE) |
| `@splinetool/react-spline` | 4.1.0 | MIT | Included `LICENSE`, copyright (c) 2022 Spline, Inc.; its package metadata omits the license field |
| `@splinetool/runtime` | 1.10.71 | Not declared | No license field or top-level license file in the installed package; see below |
| `@testing-library/dom` | 10.4.1 | MIT | Included `LICENSE` |
| `@testing-library/jest-dom` | 6.8.0 | MIT | Included `LICENSE` |
| `@testing-library/react` | 16.3.0 | MIT | Included `LICENSE` |
| `@testing-library/user-event` | 13.5.0 | MIT | Included `LICENSE` |
| `react` | 19.2.3 | MIT | Included `LICENSE` |
| `react-dom` | 19.2.3 | MIT | Included `LICENSE` |
| `react-scripts` | 5.0.1 | MIT | Included `LICENSE` |
| `wavesurfer.js` | 7.10.1 | BSD-3-Clause | Included `LICENSE` |
| `web-vitals` | 2.1.4 | Apache-2.0 | Included `LICENSE` |
| `@sygnal/code-component` | 0.5.8 | GPL-3.0-only | Included `LICENSE` and package metadata |
| `@vitejs/plugin-react` | 5.0.2 | MIT | Included `LICENSE` |
| `@webflow/data-types` | 1.1.0 | MIT | Included `LICENCE` |
| `@webflow/react` | 1.1.0 | MIT | Included `LICENCE` |
| `@webflow/webflow-cli` | 1.10.0 | MIT | Included `LICENCE` |
| `vite` | 7.1.4 | MIT | Included `LICENSE.md`, including bundled third-party notices |

### Spline runtime: unresolved license

The MIT license shipped with `@splinetool/react-spline` does not establish a license for the separate `@splinetool/runtime` package. Version 1.10.71 has no declared license or top-level license file. Its README identifies copyright (c) 2025 Spline, Inc. The Spline component dynamically imports this runtime, so this matters for builds that include it.

An [upstream issue requests an explicit runtime license](https://github.com/splinetool/react-spline/issues/234). Obtain clarification from Spline for this version before redistributing the runtime or representing a complete bundle as entirely open source. Spline-hosted services and scenes also have their own terms; this project's MIT license provides no rights to them.

### Sygnal deployment CLI

The locked `@sygnal/code-component` package declares **GPL-3.0-only**, even though it is also a Sygnal package. It is invoked as a separate command by the deployment scripts; the component source does not import it. This repository's MIT declaration does not change that package's license. Any redistribution or modification of the CLI must be assessed under its own GPL terms.

## Transitive dependencies

The lockfile includes additional license families, including ISC, BSD, Apache-2.0, Python-2.0, BlueOak-1.0.0, MPL-2.0 (`axe-core`), and CC-BY-4.0 (`caniuse-lite`), as well as dual-license expressions. The [complete metadata inventory](DEPENDENCY_LICENSES.md) includes optional and platform-specific packages as well as build and test tools; these are not all necessarily shipped to end users.

Seven locked package locations omit license metadata:

| Package | Version | Inspection result |
| --- | --- | --- |
| `@splinetool/react-spline` | 4.1.0 | An MIT `LICENSE` is included |
| `@splinetool/runtime` | 1.10.71 | No top-level license file found; unresolved above |
| `exit` | 0.1.2 | `LICENSE-MIT` is included |
| `jsonpath/node_modules/esprima` | 1.2.2 | No top-level license file found; inspect source notices and upstream terms before redistribution |
| `static-eval/node_modules/prelude-ls` | 1.1.2 | `LICENSE` is included |
| `unionfs` | 4.6.0 | `LICENSE` is included |
| `webflow-api` | 3.2.0 | No top-level license file found; inspect source notices and upstream terms before redistribution |

Retain required copyright, attribution, license, and NOTICE texts for dependencies actually distributed. For bundled third-party code, gather notices from the exact installed versions and the build output. This document and the inventory are not a complete bundle of upstream license texts or a certification of license compliance.

## Media and other assets

The legacy demonstration app, its music and Spline scene references, bundled Rive files, and React starter branding have been removed from the current source tree.

The remotely hosted play/pause SVGs referenced in `src/BackgroundVideo.tsx` are intentionally retained; the maintainer has confirmed their use is authorized. Component users supply their own audio, video, animation, scene, and image assets and are responsible for the applicable permissions. This project's MIT license does not grant rights to third-party media or branding.
