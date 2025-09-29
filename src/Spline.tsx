import React, { CSSProperties, useEffect } from 'react';

export interface SplineProps {
  splineUrl: string | { href: string };
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  responsive?: boolean;
}

export const Spline: React.FC<SplineProps> = ({
  splineUrl,
  width = '100%',
  height = '500px',
  className,
  style,
  loading,
  error,
  responsive = true,
  onLoad,
}) => {

  // Extract URL string from Link object or use as-is if string
  const getUrlString = (url: string | { href: string }): string => {
    if (typeof url === 'string') {
      return url;
    }
    if (url && typeof url === 'object' && 'href' in url) {
      return url.href;
    }
    return '';
  };

  const urlString = getUrlString(splineUrl);

  useEffect(() => {
    console.log('Spline component mounted with props:', {
      splineUrl,
      urlString,
      width,
      height,
      className,
      responsive
    });

    // Call onLoad to simulate successful loading
    if (onLoad) {
      console.log('Calling onLoad callback');
      onLoad();
    }

    return () => {
      console.log('Spline component unmounting');
    };
  }, [splineUrl, urlString, width, height, className, responsive, onLoad]);
  const containerStyle: CSSProperties = {
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
    ...(responsive && {
      maxWidth: '100%',
      aspectRatio: typeof width === 'number' && typeof height === 'number'
        ? `${width} / ${height}`
        : undefined,
    }),
    ...style,
  };

  const sceneId = urlString.split('/').find(part =>
    part && !part.includes('.') && part.length > 10
  ) || 'scene';

  console.log('Rendering Spline component with sceneId:', sceneId, 'from URL:', urlString);

  return (
    <div className={className} style={containerStyle}>
      <canvas
        id={`spline-canvas-${sceneId}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        ref={(canvas) => {
          if (canvas && urlString) {
            // Load Spline runtime and scene
            import('@splinetool/runtime').then((SPLINE) => {
              console.log('Loading Spline scene:', urlString);
              const app = new SPLINE.Application(canvas);
              app.load(urlString).then(() => {
                console.log('Spline scene loaded successfully');
                if (onLoad) onLoad();
              }).catch((error) => {
                console.error('Failed to load Spline scene:', error);
              });
            }).catch((error) => {
              console.error('Failed to load Spline runtime:', error);
              // Fallback to placeholder if runtime fails
              if (canvas.parentElement) {
                canvas.parentElement.innerHTML = `
                  <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f0f0f0;
                    color: #666;
                    font-size: 16px;
                  ">
                    Spline Runtime Unavailable<br>
                    <small>${sceneId}</small>
                  </div>
                `;
              }
            });
          }
        }}
      />
    </div>
  );
};

export default Spline;