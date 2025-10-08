import React, { useRef, useState, useEffect } from 'react';
import './BackgroundVideo.css';

export interface BackgroundVideoProps {
  videoUrlMp4?: string;
  videoUrlWebm?: string;
  posterImage?: {
    src: string;
    alt?: string;
  };
  aspectRatio?: string;
  showControls?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrlMp4,
  videoUrlWebm,
  posterImage,
  aspectRatio = 'Auto',
  showControls = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoAspectRatio, setAutoAspectRatio] = useState<string | undefined>();
  const videoId = useRef(`bg-video-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadata = () => {
      if (aspectRatio === 'Auto' && video.videoWidth && video.videoHeight) {
        setAutoAspectRatio(`${video.videoWidth} / ${video.videoHeight}`);
      }
    };

    video.addEventListener('loadedmetadata', handleMetadata);

    // Auto-play on mount
    video.play().catch(() => {
      // Autoplay was prevented
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
    };
  }, [aspectRatio]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const videoUrls = [videoUrlMp4, videoUrlWebm].filter(Boolean).join(',');
  const posterSrc = posterImage?.src;

  // Convert aspect ratio string to CSS value
  const getAspectRatioStyle = () => {
    if (aspectRatio === 'Auto') {
      return autoAspectRatio;
    }
    // Convert "16:9" format to "16 / 9" for CSS
    return aspectRatio?.replace(':', ' / ');
  };

  const aspectRatioValue = getAspectRatioStyle();

  return (
    <div
      data-poster-url={posterSrc || ''}
      data-video-urls={videoUrls}
      data-autoplay="true"
      data-loop="true"
      data-wf-ignore="true"
      className="background-video"
      style={aspectRatioValue ? { aspectRatio: aspectRatioValue } : undefined}
    >
      <video
        id={videoId.current}
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
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
