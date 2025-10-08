# BackgroundVideo Component

A Webflow component for displaying full-width background videos with optional controls and accessibility features.

## Overview

The BackgroundVideo component renders an auto-playing, looping video element designed to be used as a background element. It includes support for multiple video formats, poster images, play/pause controls, and reduced motion accessibility.

## Component Files

- **BackgroundVideo.tsx** - Main React component implementation
- **BackgroundVideo.webflow.tsx** - Webflow integration wrapper
- **BackgroundVideo.css** - Component styles

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `videoUrlMp4` | Text | `''` | URL to the MP4 video file |
| `videoUrlWebm` | Text | `''` | URL to the WEBM video file |
| `posterImage` | Image | `undefined` | Fallback poster image shown before video loads and for reduced motion |
| `showControls` | Bool | `false` | Show/hide the play/pause control button |

## Features

### Video Playback
- Auto-plays on component mount
- Loops continuously
- Muted by default (required for autoplay)
- `playsinline` attribute for mobile support
- Object-fit cover for responsive scaling

### Multiple Format Support
- Supports both MP4 and WEBM formats
- Browser automatically selects compatible format
- Both formats recommended for maximum compatibility

### Accessibility
- **Reduced Motion Support**: Displays static poster image when user has `prefers-reduced-motion` enabled
- **ARIA Labels**: Play/pause button includes proper `aria-controls` attribute
- **Live Region**: Control wrapper uses `aria-live="polite"` for screen reader updates

### Controls
- Optional play/pause button (bottom-right corner)
- Uses Webflow CDN icons for consistent design
- Toggle visibility via `showControls` property
- Semi-transparent background for visibility over video

### Fallback Handling
- Poster image displays in `<noscript>` for no-JavaScript environments
- Background image on video element shows during loading
- Reduced motion media query shows static image instead of video

## HTML Structure

```html
<div class="w-background-video w-background-video-atom" data-wf-ignore="true">
  <video autoplay loop muted playsinline data-object-fit="cover">
    <source src="[MP4 URL]" type="video/mp4" />
    <source src="[WEBM URL]" type="video/webm" />
  </video>

  <noscript>
    <!-- Fallback poster image -->
  </noscript>

  <div aria-live="polite">
    <button class="w-background-video--control">
      <!-- Play/Pause icons -->
    </button>
  </div>
</div>
```

## CSS Classes

- `.w-background-video` - Container wrapper
- `.w-background-video-atom` - Webflow atom class
- `.w-background-video--control` - Play/pause button
- `.w-backgroundvideo-backgroundvideoplaypausebutton` - Webflow control class

## Data Attributes

- `data-poster-url` - Stores poster image URL
- `data-video-urls` - Comma-separated list of video URLs
- `data-autoplay="true"` - Indicates autoplay behavior
- `data-loop="true"` - Indicates looping behavior
- `data-wf-ignore="true"` - Webflow processing flag
- `data-object-fit="cover"` - Video scaling method
- `data-w-bg-video-control="true"` - Identifies control button
- `data-wf-bgvideo-fallback-img="true"` - Identifies fallback image

## Usage in Webflow

1. Add the BackgroundVideo component to your page
2. Set the **Video URL (MP4)** property with your MP4 video URL
3. Optionally set **Video URL (WEBM)** for better browser support
4. Set **Poster Image** for loading fallback and accessibility
5. Enable **Show Controls** if you want users to control playback

## Best Practices

### Video Format
- Provide both MP4 and WEBM for maximum browser compatibility
- MP4 for Safari/iOS support
- WEBM for Chrome/Firefox optimization

### Performance
- Use appropriately sized videos (not too large)
- Compress videos for web delivery
- Consider video length for looping backgrounds

### Accessibility
- Always provide a poster image
- Poster image should be representative of the video content
- Consider users with `prefers-reduced-motion` enabled
- Keep autoplay muted to avoid unexpected audio

### Design
- Ensure text/content over video has sufficient contrast
- Test readability with video playing
- Consider overlay gradients for better text visibility

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers with `playsinline` support
- Graceful degradation for older browsers via poster image
- No-JavaScript fallback via `<noscript>` tag

## Examples

### Basic Background Video
```tsx
<BackgroundVideo
  videoUrlMp4="https://example.com/video.mp4"
  posterImage="https://example.com/poster.jpg"
/>
```

### With Controls and Multiple Formats
```tsx
<BackgroundVideo
  videoUrlMp4="https://example.com/video.mp4"
  videoUrlWebm="https://example.com/video.webm"
  posterImage="https://example.com/poster.jpg"
  showControls={true}
/>
```

## Implementation Details

### State Management
- `isPlaying` state tracks video playback status
- `videoRef` provides direct video element access
- Unique `videoId` generated for each instance

### Lifecycle
- Video auto-plays on mount via `useEffect`
- Catches and handles autoplay prevention
- Updates playing state if autoplay blocked

### Control Logic
- `togglePlayPause` function handles button clicks
- Toggles between `play()` and `pause()` methods
- Updates state and button icons accordingly
