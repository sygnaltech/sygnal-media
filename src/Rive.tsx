import React, { CSSProperties, useEffect, useRef } from 'react';

export interface RiveProps {
  riveUrl: string | { href: string };
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
  autoplay?: boolean;
  stateMachine?: string;
  artboard?: string;
  fit?: 'Contain' | 'Cover' | 'Fill' | 'Fit Width' | 'Fit Height' | 'None' | 'Scale Down';
}

export const Rive: React.FC<RiveProps> = ({
  riveUrl,
  width = '100%',
  height = '500px',
  className,
  style,
  loading,
  error,
  responsive = true,
  autoplay = true,
  stateMachine,
  artboard,
  fit = 'Contain',
  onLoad,
  onError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveInstanceRef = useRef<any>(null);

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

  const urlString = getUrlString(riveUrl);

  // Map Webflow variant values to Rive fit values
  const getRiveFitValue = (webflowFit: string) => {
    switch (webflowFit) {
      case 'Contain': return 'contain';
      case 'Cover': return 'cover';
      case 'Fill': return 'fill';
      case 'Fit Width': return 'fitWidth';
      case 'Fit Height': return 'fitHeight';
      case 'None': return 'none';
      case 'Scale Down': return 'scaleDown';
      default: return 'contain';
    }
  };

  useEffect(() => {
    console.log('Rive component mounted with props:', {
      riveUrl,
      urlString,
      width,
      height,
      className,
      responsive,
      autoplay,
      stateMachine,
      artboard,
      fit
    });

    const canvas = canvasRef.current;
    if (!canvas || !urlString) return;

    // Load Rive runtime and animation
    const loadRive = async () => {
      try {
        // Dynamically import Rive runtime
        const { Rive: RiveRuntime } = await import('@rive-app/canvas');

        console.log('Loading Rive animation:', urlString);

        const riveInstance = new RiveRuntime({
          src: urlString,
          canvas: canvas,
          autoplay: autoplay,
          stateMachines: stateMachine ? [stateMachine] : undefined,
          artboard: artboard,
          fit: getRiveFitValue(fit),
          onLoad: () => {
            console.log('Rive animation loaded successfully');
            // Fix blurriness on high-DPI displays by adjusting canvas resolution
            riveInstance.resizeDrawingSurfaceToCanvas();
            if (onLoad) onLoad();
          },
          onLoadError: (error: Error) => {
            console.error('Failed to load Rive animation:', error);
            if (onError) onError(error);
          },
        });

        riveInstanceRef.current = riveInstance;

      } catch (error) {
        console.error('Failed to load Rive runtime:', error);

        // Fallback to placeholder if runtime fails
        const fallbackDiv = document.createElement('div');
        fallbackDiv.style.cssText = `
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          color: #666;
          font-size: 16px;
          text-align: center;
        `;

        const animationName = urlString.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'animation';
        fallbackDiv.innerHTML = `
          Rive Runtime Unavailable<br>
          <small>${animationName}</small>
        `;

        if (canvas.parentElement) {
          canvas.parentElement.appendChild(fallbackDiv);
          canvas.style.display = 'none';
        }

        if (onError) onError(error as Error);
      }
    };

    loadRive();

    return () => {
      console.log('Rive component unmounting');
      if (riveInstanceRef.current) {
        riveInstanceRef.current.cleanup();
        riveInstanceRef.current = null;
      }
    };
  }, [urlString, autoplay, stateMachine, artboard, fit, onLoad, onError]);

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

  const animationId = urlString.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'rive';

  console.log('Rendering Rive component with animationId:', animationId, 'from URL:', urlString);

  return (
    <div className={className} style={containerStyle}>
      <canvas
        ref={canvasRef}
        id={`rive-canvas-${animationId}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

export default Rive;