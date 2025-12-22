



The AudioWavesurfer component needs to be able to save and load the waveform data from a string.

## Property 

- Waveform Data text property which describes the waveform display 
    - Put in the Advanced group 

## Data format 

- Must be efficient, perhaps a hex string or comma-separated numbers 
- Describes the waveform as a sequence of bar heights, which can be rendered 

## Setup

- Under the Advanced group  debug mode 

- When there is no Waveform data set in the property AND the debug mode prop is on 
    - When the audio waveform is loaded, generate the data string needed to represent it 
    - Emit that to the console log, adjacent to the filename being loaded so we know which data it represents 

# Approach Notes

## Overview
The component uses WaveSurfer.js which automatically generates waveform bars from audio files. We'll leverage WaveSurfer's native peak data export/import to enable pre-rendering before audio loads.

## Technical Strategy

### Current Behavior
- WaveSurfer.create() loads audio URL and decodes it
- Internally generates peak data (Float32Array, values -1 to 1)
- Renders bars automatically based on peaks
- Bar width is 2px, resolution determined by WaveSurfer (~800-2000 samples)

### New Behavior with Waveform Data

**When waveformData prop is provided:**
1. Decode the waveform data string → peak array + duration
2. Initialize WaveSurfer with `peaks` and `duration` options (instant render)
3. Simultaneously load actual audio in background for playback
4. WaveSurfer replaces peaks with real data when audio loads (seamless)

**When waveformData is empty AND debug mode is on:**
1. Audio loads normally via WaveSurfer
2. On 'decode' event, extract peaks using `wavesurfer.exportPeaks()[0]` (channel 0)
3. Encode peaks → waveform data string
4. Console.log the string with filename for easy copy/paste

## Data Format

**String Structure:**
```
duration:123.45|hexpeakdata
```

**Format Details:**
- Duration in seconds (e.g., "123.45")
- Separator: `|`
- Peak data: Hex-encoded string
  - Each peak: Float32 value (-1 to 1) normalized to 0-255
  - Convert to hex: `Math.floor((peak + 1) * 127.5).toString(16).padStart(2, '0')`
  - Result: 2 hex chars per sample
  - Example: 1000 samples = 2000 character hex string + duration prefix

**Encoding Function:**
```javascript
function encodePeaks(peaks: Float32Array, duration: number): string {
  const hex = Array.from(peaks)
    .map(p => Math.floor((p + 1) * 127.5).toString(16).padStart(2, '0'))
    .join('');
  return `${duration}|${hex}`;
}
```

**Decoding Function:**
```javascript
function decodeWaveformData(data: string): { peaks: Float32Array, duration: number } {
  const [durationStr, hexData] = data.split('|');
  const duration = parseFloat(durationStr);

  const peaks = new Float32Array(hexData.length / 2);
  for (let i = 0; i < peaks.length; i++) {
    const hex = hexData.substr(i * 2, 2);
    const value = parseInt(hex, 16);
    peaks[i] = (value / 127.5) - 1; // Convert back to -1 to 1 range
  }

  return { peaks, duration };
}
```

## Implementation Changes

### 1. Add Webflow Property
In `AudioWavesurfer.webflow.tsx`, add to Advanced group:
```javascript
waveformData: props.Text({
    name: "Waveform Data",
    defaultValue: "",
    tooltip: "Pre-encoded waveform data for instant rendering. Generate using Debug mode.",
    group: "Advanced"
})
```

### 2. Modify WaveSurfer Initialization
In `AudioWavesurfer.tsx` around line 95-102:

```javascript
// Check if we have pre-computed waveform data
let wavesurferConfig: any = {
  container: waveformRef.current,
  waveColor: gradient,
  progressColor: progressGradient,
  barWidth: 2,
};

if (waveformData && waveformData.trim()) {
  // Pre-render from waveform data
  const { peaks, duration } = decodeWaveformData(waveformData);
  wavesurferConfig.peaks = [peaks];
  wavesurferConfig.duration = duration;
} else {
  // Normal load from URL
  wavesurferConfig.url = mp3.href;
}

const wavesurfer = WaveSurfer.create(wavesurferConfig);
wavesurferRef.current = wavesurfer;

// If we pre-rendered, now load actual audio for playback
if (waveformData && waveformData.trim()) {
  wavesurfer.load(mp3.href);
}
```

### 3. Add Debug Output
In the existing `decode` event handler (line 195-197):

```javascript
wavesurfer.on("decode", (duration) => {
  if (durationEl) durationEl.textContent = formatTime(duration);

  // Generate waveform data for debug mode
  if (debug && (!waveformData || !waveformData.trim())) {
    const exportedPeaks = wavesurfer.exportPeaks();
    const peaks = exportedPeaks[0]; // Use channel 0 (mono or left channel)
    const encodedData = encodePeaks(peaks, duration);

    console.log(`Waveform data for "${mp3.href}":`);
    console.log(encodedData);
    console.log(`(Duration: ${duration}s, ${peaks.length} samples)`);
  }
});
```

## Visual Consistency

**No changes to visual rendering:**
- Same gradients (CSS variables preserved)
- Same bar width (2px)
- Same bar count (WaveSurfer's native resolution)
- Same styling and interactions

**The only difference:**
- Without waveformData: Bars appear when audio decodes (~1-3 seconds)
- With waveformData: Bars appear instantly, then audio loads in background

## Usage Workflow

1. **Designer enables Debug mode** on component
2. **Preview/publish** the page
3. **Open browser console**, play the audio
4. **Copy the waveform data string** from console
5. **Paste into "Waveform Data" property** in Webflow Designer
6. **Disable Debug mode**
7. **Publish** - now waveform renders instantly!

## Channel Selection Rationale

Using channel 0 (first channel) because:
- Mono audio: Only has channel 0
- Stereo audio: Channels are typically very similar
- Reduces data size by 50% vs storing both channels
- WaveSurfer's default visualization averages channels anyway


