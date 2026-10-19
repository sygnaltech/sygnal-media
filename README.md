# Sygnal Media

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Webflow Code Components](https://img.shields.io/badge/Webflow-Code%20Components-4353FF)](https://components.sygnal.com/sygnal-webflow-components/cc/sygnal-media)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)

React and TypeScript media components for Webflow: background video, video players, audio waveforms, Rive animations, Spline scenes, and 360-degree product viewers.

Created by **Michael Wells** at [Sygnal](https://www.sygnal.com/). Project code is available under the [MIT License](LICENSE); dependencies and media retain their own terms, described below.

- [Component gallery and documentation](https://components.sygnal.com/sygnal-webflow-components/cc/sygnal-media)
- [Webflow component documentation](https://components.sygnal.com/sygnal-webflow-components)
- [Report an issue or request a feature](https://github.com/sygnaltech/sygnal-media/issues)

## Components

| Component | What it does | Implementation |
| --- | --- | --- |
| Background Video | Background playback, poster images, optional controls, hover playback, and reduced-motion handling | [BackgroundVideo.tsx](src/BackgroundVideo.tsx) |
| Video Player | Standard playback or muted autoplay, optional unmute control, aspect ratios, and configurable controls | [VideoPlayer.tsx](src/VideoPlayer.tsx) |
| Audio (HTML5) | Native audio playback with optional controls, looping, and preloading | [Audio.tsx](src/Audio.tsx) |
| Audio (WaveSurfer) | Waveform playback, time display, hover previews, and coordinated playback between players | [AudioWavesurfer.tsx](src/AudioWavesurfer.tsx) |
| Rive (Canvas) | Rive animation playback with artboard, layout, and autoplay options | [RiveCanvas.tsx](src/RiveCanvas.tsx) |
| Rive (WebGL2) | Rive playback using the WebGL2 renderer | [RiveWebGL2.tsx](src/RiveWebGL2.tsx) |
| Spline | Interactive 3D scenes loaded through the Spline runtime | [Spline.tsx](src/Spline.tsx) |
| Flipbook | Drag or swipe through an image sequence to rotate a product through 360 degrees | [Flipbook.tsx](src/Flipbook.tsx) |

Each component has a matching `*.webflow.tsx` wrapper that declares its properties for Webflow Designer.

## Local development

Use Node.js **20.19+ on the 20.x line, or 22.12+** and npm, matching the locked Vite tooling's engine requirements.

```sh
git clone https://github.com/sygnaltech/sygnal-media.git
cd sygnal-media
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`. The minimal development page is in [src/main.tsx](src/main.tsx). Import the components you want to work on there and supply your own media. Local preview and build do not require Webflow credentials.

No demo music, Spline scene, or Rive files are included. To preview Flipbook, supply your own JSON and image URLs:

```json
{
  "images": [
    "/rotation/frame-001.jpg",
    "/rotation/frame-002.jpg",
    "/rotation/frame-003.jpg"
  ]
}
```

Place the JSON and images in `public/` for local development. Use media you have permission to use; see [media and other assets](THIRD_PARTY_NOTICES.md#media-and-other-assets).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the local development page into `dist/` |
| `npm run preview` | Serve the built application locally |
| `npm run licenses` | Regenerate the dependency license inventory from the lockfile |

`npm start`, `npm test`, and `npm run eject` are retained legacy Create React App commands. The starter app and its test have been removed; no automated tests currently remain. Use Vite for local development and builds.

## Using the components

For Webflow, use the [gallery and setup documentation](https://components.sygnal.com/sygnal-webflow-components/cc/sygnal-media) to install the library and configure properties in Designer.

For a React application, copy the required implementation files and any accompanying CSS and local helpers into your project, then install their dependencies. For example:

```tsx
import { Audio } from './Audio';

export function Example() {
  return (
    <Audio
      id="sample-audio"
      mp3={{ href: '/audio/sample.mp3' }}
      controls={true}
      loop={false}
      preload={false}
    />
  );
}
```

This repository is a source project and Webflow library, with a minimal local development page; it is not currently published as an installable npm component package. The `private: true` package flag prevents accidental npm publication and does not restrict the MIT license.

See [background video documentation](BackgroundVideo.md), [JavaScript API patterns](JSAPI.md), and the [media player manager implementation](src/MediaPlayerManager.tsx) for more detail.

## Deploying a Webflow library

Deployment requires access to a Webflow workspace and authentication for the Webflow CLI. The Sygnal deployment helper uses [webflow.main.json](webflow.main.json) as its base configuration and generates the ignored `webflow.json` and temporary deployment files.

```sh
npm run deploy-test
```

Use `npm run deploy-prod` for an explicit release, or `npm run deploy` to select release or prerelease mode from the current Git branch. Review the target workspace before deploying. Keep credentials in your local environment or CI secrets.

## Dependencies and licenses

The MIT license covers Michael Wells's original code and documentation in this repository. It does not relicense dependencies, upstream code, trademarks, or third-party media.

| Direct dependencies | License | Use |
| --- | --- | --- |
| `react`, `react-dom` | MIT | Component rendering |
| `@rive-app/canvas`, `@rive-app/webgl2` | MIT | Rive animation runtimes |
| `wavesurfer.js` | BSD-3-Clause | Waveform audio playback |
| `@splinetool/react-spline` | MIT (included license file) | Declared Spline React integration dependency |
| `@splinetool/runtime` | Not declared in locked version 1.10.71 | Runtime dynamically loaded by the Spline component; licensing needs upstream clarification |
| `web-vitals` | Apache-2.0 | Retained legacy dependency; unused by component source |
| `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event` | MIT | Testing utilities |
| `react-scripts` | MIT | Legacy Create React App tooling and test runner |
| `vite`, `@vitejs/plugin-react` | MIT | Development server and application build |
| `@webflow/data-types`, `@webflow/react`, `@webflow/webflow-cli` | MIT | Webflow declarations and deployment tooling |
| `@sygnal/code-component` | GPL-3.0-only | Separate deployment CLI; not imported by component source |

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for versions, attribution, media exclusions, and unresolved license declarations. The generated [dependency inventory](DEPENDENCY_LICENSES.md) also lists transitive and development packages, including their declared license expressions. Preserve applicable upstream license texts and notices when distributing dependencies or compiled bundles; this table is an overview, not a replacement for those notices.

## Contributing

Issues and pull requests are welcome. Describe the behavior, include reproduction steps for bugs, and run `npm run build` for code changes. Test affected components locally and in Webflow where applicable. If dependencies change, commit the updated lockfile, run `npm run licenses`, and review the notices. Contributions to project code are provided under the project's MIT license.

## Author and contact

Michael Wells - [mike@sygnal.com](mailto:mike@sygnal.com) - [Sygnal](https://www.sygnal.com/)

Copyright (c) 2026 Michael Wells. Licensed under [MIT](LICENSE).

## Topics

Suggested GitHub repository topics (also included as package keywords):

`webflow`, `webflow-code-components`, `react`, `typescript`, `media`, `video-player`, `background-video`, `audio-player`, `wavesurfer`, `rive`, `spline`, `360-product-viewer`, `flipbook`
