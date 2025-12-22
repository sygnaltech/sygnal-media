# Bug: Waveform Double Render

## Issue Description

When `waveformData` property is set with pre-encoded waveform data, the component initially renders the waveform correctly from the cached data, but then WaveSurfer re-decodes the audio file and redraws the waveform, causing a visual flicker/update.

## Expected Behavior

When `waveformData` is provided:
1. Waveform renders instantly from cached peak data
2. Audio loads in background for playback
3. Waveform visualization remains stable (no redraw)

## Actual Behavior

When `waveformData` is provided:
1. Waveform renders instantly from cached peak data ✓
2. Audio loads via `wavesurfer.load(mp3.href)`
3. **WaveSurfer re-decodes the audio and redraws the waveform** ✗

## Root Cause

At [AudioWavesurfer.tsx:117-120](../src/AudioWavesurfer.tsx#L117-L120):

```javascript
// If we pre-rendered, now load actual audio for playback
if (waveformData && waveformData.trim()) {
  wavesurfer.load(mp3.href);
}
```

The `wavesurfer.load()` method does not just load audio for playback - it **re-decodes the entire audio file and re-renders the waveform**, replacing the pre-rendered peaks.

## Technical Details

### Current Implementation Flow

1. WaveSurfer is initialized with `peaks` and `duration` config:
   ```javascript
   wavesurferConfig.peaks = [peaks];
   wavesurferConfig.duration = duration;
   ```

2. WaveSurfer.create() renders waveform from peaks (instant)

3. Then `wavesurfer.load(mp3.href)` is called

4. WaveSurfer's load() method:
   - Fetches the audio file
   - Decodes it via Web Audio API
   - Fires `decode` event
   - **Redraws the waveform with new peaks**

### Why This Happens

WaveSurfer.js treats `load()` as a full initialization operation that includes waveform generation. There's no built-in "load audio only without waveform update" mode.

## Possible Solutions

### Option 1: Don't Load Audio (Current Limitation)
- Keep pre-rendered waveform
- Don't call `wavesurfer.load()`
- **Problem**: Audio won't be playable

### Option 2: Use Separate Audio Element (Complex)
- Create WaveSurfer with peaks only (no audio)
- Create hidden `<audio>` element for playback
- Manually sync playback position between audio element and WaveSurfer
- **Pros**: Full control, waveform stays pre-rendered
- **Cons**: Complex implementation, breaks WaveSurfer's integrated playback

### Option 3: Prevent Waveform Redraw (Hack)
- Detect when audio is loading from pre-rendered state
- Intercept or ignore `decode` event to prevent redraw
- **Pros**: Simpler than Option 2
- **Cons**: Fighting against WaveSurfer's internal behavior, may break

### Option 4: Accept the Redraw (Current State)
- User sees instant waveform from cache
- Then it updates with real decoded data
- **Pros**: Simple, works with WaveSurfer's design
- **Cons**: Visual flicker, defeats the purpose if peaks don't match exactly

### Option 5: Skip Audio Decode When Peaks Match
- Check if we can configure WaveSurfer to skip decoding when peaks are provided
- Investigate WaveSurfer API for "media-only" loading mode
- **Status**: Needs API research

## WaveSurfer.js API Investigation Needed

Questions to research in WaveSurfer.js documentation:

1. Does `load()` support a parameter to skip waveform decoding?
2. Can we initialize with peaks and then attach media separately?
3. Is there a `setMedia()` or similar method that doesn't trigger decode?
4. Can we listen for `decode` and prevent the waveform update?
5. Does the backend/media plugin system allow playback without decoding?

## Workaround Ideas

### Idea A: Use `backend: 'MediaElement'`
WaveSurfer supports different backends. The MediaElement backend might allow audio playback without requiring decoded peaks.

### Idea B: Restore Peaks After Decode
```javascript
wavesurfer.on("decode", (duration) => {
  if (waveformData && waveformData.trim()) {
    // Restore pre-rendered peaks after decode
    const { peaks } = decodeWaveformData(waveformData);
    // Need to find WaveSurfer API to update peaks without full re-init
  }
});
```

### Idea C: Conditional Load
Only load audio when user tries to play:
```javascript
let audioLoaded = false;

svgPlay?.addEventListener("click", async () => {
  if (!audioLoaded && waveformData) {
    await wavesurfer.load(mp3.href);
    audioLoaded = true;
  }
  wavesurfer.play();
});
```
**Con**: First play attempt has delay

## Impact

- **Severity**: Medium
- **User Experience**: Waveform appears instantly but then visibly redraws
- **Performance**: Double work - pre-render + decode (wastes the pre-render effort)
- **Functionality**: Still works, just not as optimized as intended

## Next Steps

1. Research WaveSurfer.js v7.10.1 API documentation for media-only loading
2. Test different backend options (MediaElement vs WebAudio)
3. Prototype one of the workaround ideas
4. Consider if "acceptable flicker" is good enough for MVP
