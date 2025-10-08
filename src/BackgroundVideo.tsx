import React, { useRef, useState, useEffect } from 'react';
import './BackgroundVideo.css';

export interface BackgroundVideoProps {
  videoUrlMp4?: string;
  videoUrlWebm?: string;
  posterImage?: string;
  showControls?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrlMp4,
  videoUrlWebm,
  posterImage,
  showControls = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoId = useRef(`bg-video-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Auto-play on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented
        setIsPlaying(false);
      });
    }
  }, []);

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

  return (
    <div
      data-poster-url={posterImage || ''}
      data-video-urls={videoUrls}
      data-autoplay="true"
      data-loop="true"
      data-wf-ignore="true"
      className="w-background-video w-background-video-atom"
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
        style={posterImage ? { backgroundImage: `url('${posterImage}')` } : undefined}
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
        {posterImage && (
          <img
            data-wf-bgvideo-fallback-img="true"
            src={posterImage}
            alt=""
          />
        )}
      </noscript>

      {showControls && (
        <div aria-live="polite">
          <button
            type="button"
            data-w-bg-video-control="true"
            aria-controls={videoId.current}
            className="w-backgroundvideo-backgroundvideoplaypausebutton w-background-video--control"
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
