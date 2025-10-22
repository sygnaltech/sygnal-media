
# Sygnal Media — Webflow Code Components

A set of Webflow Code Components focused on media: background video, audio players, 3D scenes, Rive animations, and 360° product rotation.

- Component gallery and docs: https://components.sygnal.com/sygnal-webflow-components/cc/sygnal-media
- Package docs root: https://components.sygnal.com/sygnal-webflow-components


## Components

### Background Video
Full‑bleed background video with optional controls, multiple sources, poster fallback, and reduced‑motion handling.

Files:
- `src/BackgroundVideo.tsx:1` main component
- `src/BackgroundVideo.webflow.tsx:1` Webflow wrapper/props
- `src/BackgroundVideo.css:1` styles

Props (Webflow):
- `videoUrlMp4` (Text) — MP4 source URL
- `videoUrlWebm` (Text) — WEBM source URL (optional)
- `posterImage` (Image) — fallback poster image
- `aspectRatio` (Variant) — Auto | 16:9 | 4:3 | 21:9 | 1:1 | 9:16
- `autoplayMode` (Variant) — Autoplay | Autoplay on Hover | No Autoplay
- `showControls` (Boolean) — show/hide play/pause button
- `debug` (Boolean, Advanced) — console logging

Features:
- Auto aspect‑ratio detection (when set to Auto)
- Hover‑to‑play mode and manual controls
- Poster fallback in `<noscript>` and supports `prefers-reduced-motion`
- Non‑interactive in Designer (no autoplay)

See also: `BackgroundVideo.md:1` for a deeper dive.


### Audio (HTML5)
Simple HTML5 audio element with optional controls.

Files:
- `src/Audio.tsx:1` main component
- `src/Audio.webflow.tsx:1` Webflow wrapper/props

Props (Webflow):
- `mp3` (Link) — asset or external MP3
- `loop` (Boolean) — loop playback
- `preload` (Boolean) — Auto (true) or Off (false)
- `controls` (Boolean) — show native controls
- `id` (Id, Advanced) — optional identifier for external scripting


### Audio (Wavesurfer)
Waveform audio player built on Wavesurfer.js with play/pause UI, hover preview, time/duration, and theming via CSS variables.

Files:
- `src/AudioWavesurfer.tsx:1` main component
- `src/AudioWavesurfer.webflow.tsx:1` Webflow wrapper/props
- `src/AudioWavesurfer.css:1` styles and theme variables

Props (Webflow):
- `mp3` (Link) — asset or external MP3
- `loop` (Boolean) — loop playback
- `preload` (Boolean) — Auto (true) or Off (false)
- `id` (Id, Advanced) — optional unique player ID for external control
- `namespace` (Id, Advanced) — optional namespace for ID scoping
- `debug` (Boolean, Advanced) — console logging

Styling (CSS variables):
- Colors — `--cc-audio-wavesurfer-top`, `--cc-audio-wavesurfer-separator`, `--cc-audio-wavesurfer-bottom`
- Progress — `--cc-audio-wavesurfer-progress-top`, `--cc-audio-wavesurfer-progress-mid`, `--cc-audio-wavesurfer-progress-bottom`
- UI — `--cc-audio-wavesurfer-button-size`, `--cc-audio-wavesurfer-icon`, `--cc-audio-wavesurfer-separator-pos`, `--cc-audio-wavesurfer-bar-width`, `--cc-audio-wavesurfer-min-width`

Behavior:
- Pauses other players on play (via MediaPlayerManager)
- External control available when `id` is provided


### Rive (Canvas)
Rive animation player using the Canvas renderer (broad compatibility; no vector feathering).

Files:
- `src/RiveCanvas.tsx:1` main component
- `src/RiveCanvas.webflow.tsx:1` Webflow wrapper/props

Props (Webflow):
- `riveUrl` (Link) — .riv file (asset or URL)
- `artboard` (Text) — artboard name (optional)
- `stateMachine` (Text) — state machine name (optional)
- `fit` (Variant) — Contain | Cover | Fill | Fit Width | Fit Height | None | Scale Down
- `align` (Variant) — Center | Top Center | Top Right | Center Left | Center Right | Bottom Left | Bottom Center | Bottom Right
- `width` (Text) — container width (default 100%)
- `height` (Text) — container height (default 500px)
- `responsive` (Boolean) — responsive container sizing
- `autoplay` (Boolean) — start automatically
- `touchScrollBehavior` (Boolean) — allow page scroll while touching canvas
- `automaticallyHandleEvents` (Boolean) — handle Rive events (e.g. open URL)
- `lazy` (Boolean, Advanced) — lazy‑load


### Rive (WebGL2)
Rive animation player using the WebGL2 renderer (supports vector feathering; requires WebGL2 support).

Files:
- `src/RiveWebGL2.tsx:1` main component
- `src/RiveWebGL2.webflow.tsx:1` Webflow wrapper/props

Props: same as Rive (Canvas).

Notes:
- Displays a friendly fallback if WebGL2 is unavailable.


### Spline
Interactive 3D Spline scene viewer using `@splinetool/runtime`.

Files:
- `src/Spline.tsx:1` main component
- `src/Spline.webflow.tsx:1` Webflow wrapper/props

Props (Webflow):
- `splineUrl` (Link) — Spline scene URL
- `width` (Text) — container width (default 100%)
- `height` (Text) — container height (default 500px)
- `responsive` (Boolean) — responsive container sizing
- `lazy` (Boolean) — lazy‑load


### Rotate 360
High‑resolution, drag‑to‑rotate product viewer. Accepts a JSON file listing image URLs and supports clockwise/counterclockwise direction.

Files:
- `src/Flipbook.tsx:1` main component
- `src/Flipbook.webflow.tsx:1` Webflow wrapper/props

Props (Webflow):
- `jsonUrl` (Link) — URL to a JSON file with an `images` array
- `rotationDirection` (Boolean) — Clockwise (true) or Counterclockwise (false)

JSON format:
```json
{
  "images": [
    "frame_0001.jpg",
    "frame_0002.jpg"
  ]
}
Features:

Drag or touch to rotate; wraps 0–360° seamlessly
Shows current angle and frame; hover overlay preview
Preloads images; handles relative paths based on the JSON file’s location
Error/loading states and mobile touch support
Global JS APIs
MediaPlayerManager (global)
The waveform players register with a global manager for coordinated control.

Global: window.mediaPlayerManager
Source: src/MediaPlayerManager.tsx:1
Methods:

playPlayer(id: string): boolean
pausePlayer(id: string): boolean
pauseAll(): void
getPlayerIds(): string[]
Example:

html

<button onclick="window.mediaPlayerManager.pauseAll()">Pause All</button>
