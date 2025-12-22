import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { mediaPlayerManager, MediaPlayer } from "./MediaPlayerManager";
import "./AudioWavesurfer.css";

interface AudioWavesurferProps {
  id?: string; // Optional - if provided, enables external control
  namespace?: string;
  loop: string;
  mp3: any;
  preload: string;
  debug?: boolean;
  waveformData?: string;
  label?: string;
}

// Helper function to encode peaks to hex string with duration
function encodePeaks(peaks: Float32Array, duration: number): string {
  const hex = Array.from(peaks)
    .map(p => Math.floor((p + 1) * 127.5).toString(16).padStart(2, '0'))
    .join('');
  return `v1.0|${duration}|${hex}`;
}

// Helper function to decode waveform data string to peaks and duration
function decodeWaveformData(data: string): { peaks: Float32Array, duration: number } {
  const parts = data.split('|');

  // Check for version prefix
  let version = 'v1.0';
  let durationStr: string;
  let hexData: string;

  if (parts[0].startsWith('v')) {
    // Versioned format: v1.0|duration|hexdata
    version = parts[0];
    durationStr = parts[1];
    hexData = parts[2];
  } else {
    // Legacy format without version: duration|hexdata
    durationStr = parts[0];
    hexData = parts[1];
  }

  const duration = parseFloat(durationStr);

  const peaks = new Float32Array(hexData.length / 2);
  for (let i = 0; i < peaks.length; i++) {
    const hex = hexData.substring(i * 2, i * 2 + 2);
    const value = parseInt(hex, 16);
    peaks[i] = (value / 127.5) - 1; // Convert back to -1 to 1 range
  }

  return { peaks, duration };
}

export const AudioWavesurfer = ({ id, loop, mp3, preload, debug, waveformData, label }: AudioWavesurferProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const mediaPlayerRef = useRef<MediaPlayer | null>(null);

  useEffect(() => {
    const initWaveSurfer = async () => {
      // Clean up any existing instance
      if (mediaPlayerRef.current) {
        mediaPlayerRef.current.isDestroyed = true;
        mediaPlayerManager.unregisterPlayer(mediaPlayerRef.current);
        mediaPlayerRef.current = null;
      }
      
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }

      if (!waveformRef.current || !playerRef.current) return;

      const getCSSVar = (name: string, fallback: string): string => {
        const el = playerRef.current;
        if (!el) return fallback;

        const value = getComputedStyle(el).getPropertyValue(name).trim();
        return value || fallback;
      };

      // Create a properly sized canvas for gradient calculations
      const canvas = document.createElement("canvas");
      canvas.width = 100; // Set explicit dimensions
      canvas.height = 100;
      const ctx = canvas.getContext("2d")!;
      const h = canvas.height * 1.35; 

      // Retrieve color theme 
      const top = getCSSVar("--cc-audio-wavesurfer-top", "#656666");
      const separator = getCSSVar("--cc-audio-wavesurfer-separator", "#ffffff");
      const bottom = getCSSVar("--cc-audio-wavesurfer-bottom", "#B1B1B1");
      const progTop = getCSSVar("--cc-audio-wavesurfer-progress-top", "#EE772F");
      const progMid = getCSSVar("--cc-audio-wavesurfer-progress-mid", "#EB4926"); 
      const progBottom = getCSSVar("--cc-audio-wavesurfer-progress-bottom", "#F6B094"); 

      const separatorPos = getCSSVar("--cc-audio-wavesurfer-separator-pos", "0.7"); 
      const barWidth = getCSSVar("--cc-audio-wavesurfer-bar-width", "2"); 
      const minWidth = getCSSVar("--cc-audio-wavesurfer-min-width", "450px"); 

      if(debug) {
        console.table({
          top,
          separator,
          bottom,
          progTop,
          progMid,
          progBottom,
          separatorPos,
          barWidth,
          minWidth,
        });
      }

      // Create gradients 
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, top); 
      gradient.addColorStop(0.7, top); 
      gradient.addColorStop(0.701, separator); 
      gradient.addColorStop(0.702, separator); 
      gradient.addColorStop(0.703, bottom); 
      gradient.addColorStop(1, bottom); 

      const progressGradient = ctx.createLinearGradient(0, 0, 0, h);
      progressGradient.addColorStop(0, progTop);
      progressGradient.addColorStop(0.7, progMid);
      progressGradient.addColorStop(0.701, separator);
      progressGradient.addColorStop(0.702, separator);
      progressGradient.addColorStop(0.703, progBottom);
      progressGradient.addColorStop(1, progBottom);

      // Instantiate WaveSurfer
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

      // Create MediaPlayer wrapper with optional id
      const mediaPlayer: MediaPlayer = {
        id: id, // Can be undefined - that's fine
        pause: () => {
          wavesurfer.pause();
        },
        play: () => {
          wavesurfer.play();
        },
        managerPause: () => {
          // Simulate clicking the pause button instead of calling wavesurfer.pause()
          const pauseButton = playerRef.current?.querySelector<HTMLElement>("#pause");
          if (pauseButton && pauseButton.style.display !== "none") {
            pauseButton.click();
          } else {
            // Fallback to direct pause if button isn't visible
            wavesurfer.pause();
          }
        }
      };

      mediaPlayerRef.current = mediaPlayer;
      mediaPlayerManager.registerPlayer(mediaPlayer);

      // When this player starts, pause all others
      wavesurfer.on("play", () => {
        if (id) {
          mediaPlayerManager.pauseAllExcept(id);
        } else {
          mediaPlayerManager.pauseAllExcept(mediaPlayer);
        }
      });

      wavesurfer.on("interaction", () => {
        // Pause all other players BEFORE starting this one
        if (id) {
          mediaPlayerManager.pauseAllExcept(id);
        } else {
          mediaPlayerManager.pauseAllExcept(mediaPlayer);
        }
        wavesurfer.play();
      });

      const svgPlay: HTMLElement = playerRef.current?.querySelector<HTMLElement>("#play")!;
      const svgPause: HTMLElement = playerRef.current?.querySelector<HTMLElement>("#pause")!;

      const playHandler = () => {
        // Pause all other players BEFORE starting this one
        if (id) {
          mediaPlayerManager.pauseAllExcept(id);
        } else {
          mediaPlayerManager.pauseAllExcept(mediaPlayer);
        }
        wavesurfer.play();
      };

      const pauseHandler = () => {
        wavesurfer.pause();
      };

      svgPlay?.addEventListener("click", playHandler);
      svgPause?.addEventListener("click", pauseHandler);

      wavesurfer.on("play", () => {
        svgPlay?.style.setProperty("display", "none");
        svgPause?.style.setProperty("display", "block");
      });

      wavesurfer.on("pause", () => {
        svgPlay?.style.setProperty("display", "block");
        svgPause?.style.setProperty("display", "none");
      });

      const hover = waveformRef.current?.querySelector("#hover");
      const pointerMoveHandler = (e: PointerEvent) => {
        if (hover) hover.style.width = `${e.offsetX}px`;
      };

      waveformRef.current?.addEventListener("pointermove", pointerMoveHandler);

      const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = `0${Math.round(seconds) % 60}`.slice(-2);
        return `${m}:${s}`;
      };

      const timeEl = waveformRef.current?.querySelector("#time");
      const durationEl = waveformRef.current?.querySelector("#duration");

      wavesurfer.on("decode", (duration) => {
        if (durationEl) durationEl.textContent = formatTime(duration);

        // Generate waveform data for debug mode
        if (debug && (!waveformData || !waveformData.trim())) {
          const exportedPeaks = wavesurfer.exportPeaks();
          const peaks = exportedPeaks[0]; // Use channel 0 (mono or left channel)
          const encodedData = encodePeaks(peaks, duration);

          if (label && label.trim()) {
            console.log(`Label: ${label}`);
          }
          console.log(`Filename: ${mp3.href}`);
          console.log(`Waveform data:`);
          console.log(encodedData);
          console.log(`(Duration: ${duration}s, ${peaks.length} samples)`);
        }
      });

      wavesurfer.on("timeupdate", (currentTime) => {
        if (timeEl) timeEl.textContent = formatTime(currentTime);
      });

      // Store event handlers for cleanup
      return () => {
        svgPlay?.removeEventListener("click", playHandler);
        svgPause?.removeEventListener("click", pauseHandler);
        waveformRef.current?.removeEventListener("pointermove", pointerMoveHandler);
      };
    };

    initWaveSurfer();

    // Cleanup on unmount or dependency change
    return () => {
      if (mediaPlayerRef.current) {
        mediaPlayerRef.current.isDestroyed = true;
        mediaPlayerManager.unregisterPlayer(mediaPlayerRef.current);
        mediaPlayerRef.current = null;
      }
      
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [id, mp3]);

  return (
    <div
      id="player"
      ref={playerRef}
      style={{ minWidth: "var(--cc-audio-wavesurfer-min-width)" }}
    >
      <div>
        <div id="play">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="100%" height="100%" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.475 2 2 6.475 2 12s4.475 10 10 10s10-4.475 10-10S17.525 2 12 2m-2 14.5v-9l6 4.5z" />
          </svg>
        </div>
        <div id="pause">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="100%" height="100%" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-1 14H9V8h2zm4 0h-2V8h2z" />
          </svg>
        </div>
      </div>
      <div id="waveform" ref={waveformRef}>
        <div id="time">0:00</div>
        <div id="duration">0:00</div>
        <div id="hover"></div>
      </div>
    </div>
  );
};