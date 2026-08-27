import React, { useRef, useState, useEffect } from 'react';
import { useWebflowContext } from '@webflow/react';
import './VideoPlayer.css';

export type VideoPlaybackMode = 'Standard' | 'Autoplay Muted' | 'Autoplay Muted with Unmute';

export interface VideoPlayerProps {
  videoUrlMp4?: string;
  videoUrlWebm?: string;
  posterImage?: {
    src: string;
    alt?: string;
  };
  aspectRatio?: string;
  playbackMode?: VideoPlaybackMode;
  loopVideo?: boolean;
  playIconColor?: string;
  audioIconColor?: string;
  audioButtonColor?: string;
  debug?: boolean;
}

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="m10 16.5l6-4.5l-6-4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"
    />
  </svg>
);

const AudioOnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 13.857v-3.714a2 2 0 0 1 2-2h2.9a1 1 0 0 0 .55-.165l6-3.956a1 1 0 0 1 1.55.835v14.286a1 1 0 0 1-1.55.835l-6-3.956a1 1 0 0 0-.55-.165H3a2 2 0 0 1-2-2Z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.5 7.5S19 9 19 11.5s-1.5 4-1.5 4m3-11S23 7 23 11.5s-2.5 7-2.5 7"
      />
    </g>
  </svg>
);

const AudioMutedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m18 14l2-2m2-2l-2 2m0 0l-2-2m2 2l2 2"
      />
      <path d="M2 13.857v-3.714a2 2 0 0 1 2-2h2.9a1 1 0 0 0 .55-.165l6-3.956a1 1 0 0 1 1.55.835v14.286a1 1 0 0 1-1.55.835l-6-3.956a1 1 0 0 0-.55-.165H4a2 2 0 0 1-2-2Z" />
    </g>
  </svg>
);

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrlMp4,
  videoUrlWebm,
  posterImage,
  aspectRatio = 'Auto',
  playbackMode = 'Standard',
  loopVideo = true,
  playIconColor,
  audioIconColor,
  audioButtonColor,
  debug = false,
}) => {
  const { interactive } = useWebflowContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isStandard = playbackMode === 'Standard';
  const hasAudioButton = playbackMode === 'Autoplay Muted with Unmute';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!isStandard);
  // Tracks whether the unmute-restart has already happened. Only the FIRST
  // unmute restarts the video; later toggles just mute/unmute in place.
  const [hasUnmuted, setHasUnmuted] = useState(false);
  const [autoAspectRatio, setAutoAspectRatio] = useState<string | undefined>();
  const videoId = useRef(`video-player-${Math.random().toString(36).substr(2, 9)}`);

  // Reload the element when the sources change (Designer prop edits)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    if (debug) console.log('[VideoPlayer] Sources reloaded', { videoUrlMp4, videoUrlWebm });
  }, [videoUrlMp4, videoUrlWebm, debug]);

  // Aspect ratio detection and play-state tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      if (debug) console.log('[VideoPlayer] No video element ref');
      return;
    }

    if (debug) {
      console.log('[VideoPlayer] Component mounted', {
        videoUrlMp4,
        videoUrlWebm,
        posterImage: posterImage?.src,
        aspectRatio,
        playbackMode,
        readyState: video.readyState,
      });
    }

    const handleMetadata = () => {
      if (debug) {
        console.log('[VideoPlayer] Metadata loaded event fired', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          aspectRatioSetting: aspectRatio,
          readyState: video.readyState,
        });
      }

      if (aspectRatio === 'Auto' && video.videoWidth && video.videoHeight) {
        const calculatedRatio = `${video.videoWidth} / ${video.videoHeight}`;
        setAutoAspectRatio(calculatedRatio);
        if (debug) console.log('[VideoPlayer] Auto aspect ratio calculated:', calculatedRatio);
      }
    };

    if (video.readyState >= 1) {
      handleMetadata();
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [aspectRatio, videoUrlMp4, videoUrlWebm, posterImage, playbackMode, debug]);

  // Apply the playback mode: autoplay muted, or sit paused waiting for a click.
  // Never autoplays in Designer (non-interactive) mode.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startMuted = !isStandard;
    setIsMuted(startMuted);
    setHasUnmuted(false);
    video.muted = startMuted;

    if (interactive && !isStandard) {
      video.play().catch((error) => {
        setIsPlaying(false);
        if (debug) console.log('[VideoPlayer] Autoplay prevented:', error);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [playbackMode, isStandard, interactive, videoUrlMp4, videoUrlWebm, debug]);

  // React does not reliably reflect the muted prop onto the element
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((error) => {
        if (debug) console.log('[VideoPlayer] Play prevented:', error);
      });
      if (debug) console.log('[VideoPlayer] Video playing');
    } else {
      video.pause();
      if (debug) console.log('[VideoPlayer] Video paused');
    }
  };

  const toggleAudio = (event: React.MouseEvent) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (!hasUnmuted) {
      // First unmute — restart from the beginning, with sound
      video.currentTime = 0;
      video.muted = false;
      setIsMuted(false);
      setHasUnmuted(true);
      video.play().catch((error) => {
        if (debug) console.log('[VideoPlayer] Unmuted play prevented:', error);
      });
      if (debug) console.log('[VideoPlayer] Unmuted and restarted');
    } else {
      const nextMuted = !isMuted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
      if (debug) console.log('[VideoPlayer] Audio toggled', { muted: nextMuted });
    }
  };

  const handleSurfaceClick = () => {
    if (isStandard) togglePlayPause();
  };

  const videoUrls = [videoUrlMp4, videoUrlWebm].filter(Boolean).join(',');
  const posterSrc = posterImage?.src;

  // Convert aspect ratio string to CSS value
  const getAspectRatioStyle = () => {
    if (aspectRatio === 'Auto') return autoAspectRatio;
    return aspectRatio?.replace(':', ' / ');
  };

  const aspectRatioValue = getAspectRatioStyle();

  // Colour props are applied as CSS custom properties, and only when set, so
  // externally-defined variables still win when a prop is left blank.
  const styleVars: Record<string, string> = {};
  if (aspectRatioValue) styleVars.aspectRatio = aspectRatioValue;
  if (playIconColor) styleVars['--cc-video-player-play-color'] = playIconColor;
  if (audioIconColor) styleVars['--cc-video-player-audio-color'] = audioIconColor;
  if (audioButtonColor) styleVars['--cc-video-player-audio-bg'] = audioButtonColor;

  if (debug) {
    console.log('[VideoPlayer] Render', {
      aspectRatioValue,
      playbackMode,
      isPlaying,
      isMuted,
      hasUnmuted,
    });
  }

  return (
    <div
      data-poster-url={posterSrc || ''}
      data-video-urls={videoUrls}
      data-autoplay={isStandard ? 'false' : 'true'}
      data-loop={loopVideo ? 'true' : 'false'}
      data-wf-ignore="true"
      className={`video-player${isStandard ? ' video-player--clickable' : ''}`}
      style={styleVars as React.CSSProperties}
      onClick={handleSurfaceClick}
    >
      <video
        id={videoId.current}
        ref={videoRef}
        autoPlay={interactive && !isStandard}
        loop={loopVideo}
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={posterSrc}
        data-wf-ignore="true"
        data-object-fit="cover"
        style={posterSrc ? { backgroundImage: `url('${posterSrc}')` } : undefined}
      >
        {videoUrlMp4 && <source src={videoUrlMp4} type="video/mp4" data-wf-ignore="true" />}
        {videoUrlWebm && <source src={videoUrlWebm} type="video/webm" data-wf-ignore="true" />}
      </video>

      <noscript>
        <style>
          {`
            [data-wf-bgvideo-fallback-img] {
              display: none;
            }
            @media (prefers-reduced-motion: reduce) {
              [data-wf-bgvideo-fallback-img] {
                position: absolute;
                z-index: -100;
                display: inline-block;
                height: 100%;
                width: 100%;
                object-fit: cover;
              }
            }
          `}
        </style>
        {posterSrc && (
          <img
            data-wf-bgvideo-fallback-img="true"
            src={posterSrc}
            alt={posterImage?.alt || ''}
          />
        )}
      </noscript>

      {isStandard && !isPlaying && (
        <button
          type="button"
          className="video-player--play"
          aria-label="Play video"
          aria-controls={videoId.current}
          onClick={(event) => {
            event.stopPropagation();
            togglePlayPause();
          }}
        >
          <PlayIcon />
        </button>
      )}

      {hasAudioButton && (
        <button
          type="button"
          className="video-player--audio"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!isMuted}
          aria-controls={videoId.current}
          onClick={toggleAudio}
        >
          {isMuted ? <AudioMutedIcon /> : <AudioOnIcon />}
        </button>
      )}
    </div>
  );
};
