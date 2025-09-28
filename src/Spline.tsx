import React, { useState, useCallback, CSSProperties } from 'react';

export interface SplineProps {
  splineUrl: string;
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
  allowFullscreen?: boolean;
}

export const Spline: React.FC<SplineProps> = ({
  splineUrl,
  width = '100%',
  height = '500px',
  className,
  style,
  loading,
  error,
  lazy = false,
  onLoad,
  onError,
  responsive = true,
  allowFullscreen = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    const error = new Error('Failed to load Spline scene');
    setIsLoading(false);
    setHasError(true);
    setLoadError(error);
    onError?.(error);
  }, [onError]);

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

  const defaultLoading = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#f5f5f5',
      color: '#666',
    }}>
      Loading Spline scene...
    </div>
  );

  const defaultError = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#fff5f5',
      color: '#e53e3e',
      textAlign: 'center',
      padding: '20px',
    }}>
      <div style={{ fontSize: '18px', marginBottom: '8px' }}>
        Failed to load Spline scene
      </div>
      {loadError && (
        <div style={{ fontSize: '14px', opacity: 0.7 }}>
          {loadError.message}
        </div>
      )}
    </div>
  );

  if (lazy && isLoading && !hasError) {
    return (
      <div className={className} style={containerStyle}>
        {loading || defaultLoading}
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {isLoading && !hasError && (loading || defaultLoading)}

      {hasError && (error || defaultError)}

      {!hasError && (
        <iframe
          src={splineUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: isLoading ? 'none' : 'block',
          }}
          onLoad={handleLoad}
          onError={handleError}
          allowFullScreen={allowFullscreen}
          title="Spline 3D Scene"
        />
      )}
    </div>
  );
};

export default Spline;