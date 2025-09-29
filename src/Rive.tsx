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
  touchScrollBehavior?: boolean;
  automaticallyHandleEvents?: boolean;
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
  touchScrollBehavior = true,
  automaticallyHandleEvents = true,
  lazy = false,
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

  // Map Webflow variant values to Rive.Fit enum values 
  // https://rive.app/docs/runtimes/layout 
  const getRiveFitValue = (webflowFit: string) => {
    // We'll get the Rive module dynamically, so return string values for now
    switch (webflowFit) {
      case 'Contain': return 'Contain';
      case 'Cover': return 'Cover';
      case 'Fill': return 'Fill';
      case 'Fit Width': return 'FitWidth';
      case 'Fit Height': return 'FitHeight';
      case 'None': return 'None';
      case 'Scale Down': return 'Scaledown';
      default: return 'Contain';
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
      fit,
      touchScrollBehavior,
      automaticallyHandleEvents
    });

    const canvas = canvasRef.current;
    if (!canvas || !urlString) return;

    // Canvas resizing function for crisp rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    // Load Rive runtime and animation
    const loadRive = async () => {
      try {
        // Dynamically import Rive runtime
        const RiveModule = await import('@rive-app/canvas');
        const { Rive: RiveRuntime, Layout, Fit, Alignment } = RiveModule;

        console.log('Loading Rive animation:', urlString);

        // Initial canvas resize
        resizeCanvas();

        // Set up ResizeObserver for responsive canvas sizing
        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas);

        // Get the appropriate Rive.Fit enum value
        const riveFitValue = Fit[getRiveFitValue(fit) as keyof typeof Fit];

        const riveInstance = new RiveRuntime({
          src: urlString,
          canvas: canvas,
          autoplay: autoplay,
          stateMachines: stateMachine ? [stateMachine] : undefined,
          artboard: artboard,
          layout: new Layout({
            fit: riveFitValue,
            alignment: Alignment.Center,
          }),
          shouldDisableRiveListeners: !touchScrollBehavior,
          automaticallyHandleEvents: automaticallyHandleEvents,
          onLoad: () => {
            console.log('Rive animation loaded successfully');
            if (onLoad) onLoad();
          },
          onLoadError: (event: any) => {
            console.error('Failed to load Rive animation:', event);
            // Convert event to Error for our callback
            const error = new Error(`Failed to load Rive animation: ${event?.type || 'unknown error'}`);
            if (onError) onError(error);
          },
        });

        riveInstanceRef.current = riveInstance;

        // Store resize observer for cleanup
        (riveInstance as any)._resizeObserver = resizeObserver;

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
        // Clean up resize observer
        if ((riveInstanceRef.current as any)._resizeObserver) {
          (riveInstanceRef.current as any)._resizeObserver.disconnect();
        }
        riveInstanceRef.current.cleanup();
        riveInstanceRef.current = null;
      }
    };
  }, [urlString, autoplay, stateMachine, artboard, fit, touchScrollBehavior, automaticallyHandleEvents, onLoad, onError]);

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