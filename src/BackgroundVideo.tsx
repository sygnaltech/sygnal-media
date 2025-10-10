import React, { useRef, useState, useEffect } from 'react';
import { useWebflowContext } from '@webflow/react';
import './BackgroundVideo.css';

export interface BackgroundVideoProps {
  videoUrlMp4?: string;
  videoUrlWebm?: string;
  posterImage?: {
    src: string;
    alt?: string;
  };
  aspectRatio?: string;
  autoplayMode?: 'Autoplay' | 'Autoplay on Hover' | 'No Autoplay';
  showControls?: boolean;
  debug?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrlMp4,
  videoUrlWebm,
  posterImage,
  aspectRatio = 'Auto',
  autoplayMode = 'Autoplay',
  showControls = false,
  debug = false,
}) => {
  const { interactive } = useWebflowContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoAspectRatio, setAutoAspectRatio] = useState<string | undefined>();
  const videoId = useRef(`bg-video-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      if (debug) console.log('[BackgroundVideo] No video element ref');
      return;
    }

    if (debug) {
      console.log('[BackgroundVideo] Component mounted', {
        videoUrlMp4,
        videoUrlWebm,
        posterImage: posterImage?.src,
        aspectRatio,
        showControls,
        readyState: video.readyState,
      });
    }

    const handleMetadata = () => {
      if (debug) {
        console.log('[BackgroundVideo] Metadata loaded event fired', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          aspectRatioSetting: aspectRatio,
          readyState: video.readyState,
        });
      }

      if (aspectRatio === 'Auto' && video.videoWidth && video.videoHeight) {
        const calculatedRatio = `${video.videoWidth} / ${video.videoHeight}`;
        setAutoAspectRatio(calculatedRatio);
        if (debug) {
          console.log('[BackgroundVideo] Auto aspect ratio calculated:', calculatedRatio);
        }
      }
    };

    const handleCanPlay = () => {
      if (debug) {
        console.log('[BackgroundVideo] Can play event fired', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        });
      }
    };

    // Check if metadata is already loaded
    if (video.readyState >= 1) {
      if (debug) {
        console.log('[BackgroundVideo] Metadata already loaded (readyState >= 1)', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState,
        });
      }
      handleMetadata();
    }

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('canplay', handleCanPlay);

    // Handle autoplay based on mode (but never autoplay in design mode)
    if (interactive && autoplayMode === 'Autoplay') {
      video.play().catch((error) => {
        // Autoplay was prevented
        setIsPlaying(false);
        if (debug) {
          console.log('[BackgroundVideo] Autoplay prevented:', error);
        }
      });
    } else if (autoplayMode === 'No Autoplay' || !interactive) {
      setIsPlaying(false);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [aspectRatio, videoUrlMp4, videoUrlWebm, posterImage, showControls, autoplayMode, interactive, debug]);

  const handleMouseEnter = () => {
    if (interactive && autoplayMode === 'Autoplay on Hover' && videoRef.current) {
      videoRef.current.play().catch((error) => {
        if (debug) {
          console.log('[BackgroundVideo] Hover play prevented:', error);
        }
      });
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive && autoplayMode === 'Autoplay on Hover' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (debug) console.log('[BackgroundVideo] Video paused');
      } else {
        videoRef.current.play();
        if (debug) console.log('[BackgroundVideo] Video playing');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const videoUrls = [videoUrlMp4, videoUrlWebm].filter(Boolean).join(',');
  const posterSrc = posterImage?.src;

  // Convert aspect ratio string to CSS value
  const getAspectRatioStyle = () => {
    if (aspectRatio === 'Auto') {
      if (debug) {
        console.log('[BackgroundVideo] Using Auto aspect ratio:', autoAspectRatio || 'not yet calculated');
      }
      return autoAspectRatio;
    }
    // Convert "16:9" format to "16 / 9" for CSS
    const converted = aspectRatio?.replace(':', ' / ');
    if (debug) {
      console.log('[BackgroundVideo] Using fixed aspect ratio:', converted);
    }
    return converted;
  };

  const aspectRatioValue = getAspectRatioStyle();

  if (debug) {
    console.log('[BackgroundVideo] Render', {
      aspectRatioValue,
      autoAspectRatio,
      isPlaying,
    });
  }

  return (
    <div
      data-poster-url={posterSrc || ''}
      data-video-urls={videoUrls}
      data-autoplay={autoplayMode === 'Autoplay' ? 'true' : 'false'}
      data-loop="true"
      data-wf-ignore="true"
      className="background-video"
      style={aspectRatioValue ? { aspectRatio: aspectRatioValue } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        id={videoId.current}
        ref={videoRef}
        autoPlay={interactive && autoplayMode === 'Autoplay'}
        loop
        muted
        playsInline
        preload="metadata"
        data-wf-ignore="true"
        data-object-fit="cover"
        style={posterSrc ? { backgroundImage: `url('${posterSrc}')` } : undefined}
      >
        {videoUrlMp4 && (
          <source src={videoUrlMp4} type="video/mp4" data-wf-ignore="true" />
        )}
        {videoUrlWebm && (
          <source src={videoUrlWebm} type="video/webm" data-wf-ignore="true" />
        )}
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

      {showControls && (
        <div aria-live="polite">
          <button
            type="button"
            data-w-bg-video-control="true"
            aria-controls={videoId.current}
            className="background-video--control"
            onClick={togglePlayPause}
          >
            <span style={{ display: isPlaying ? 'inline' : 'none' }}>
              <img
                src="https://cdn.prod.website-files.com/6022af993a6b2191db3ed10c/628299f8aa233b83918e24fd_Pause.svg"
                loading="lazy"
                alt="Pause video"
              />
            </span>
            <span style={{ display: isPlaying ? 'none' : 'inline' }}>
              <img
                loading="lazy"
                alt="Play video"
                src="https://cdn.prod.website-files.com/6022af993a6b2191db3ed10c/628298b20ae0236682d4b87f_Play-24.svg"
              />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
